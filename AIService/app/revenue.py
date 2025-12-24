
from typing import List, Dict, Any
import pandas as pd

from .models import BookingData


class RevenueAnalyzer:
    """AI-powered revenue and booking pattern analyzer"""

    def __init__(self):
        self.model = None
        self.label_encoders = {}

    def analyze_patterns(self, bookings: List[BookingData]) -> Dict[str, Any]:
        """Analyze booking patterns and generate insights"""

        if not bookings:
            return {
                "insights": ["No data available for analysis"],
                "patterns": {},
                "recommendations": []
            }

        df = pd.DataFrame([b.dict() for b in bookings])
        df['showDateTime'] = pd.to_datetime(df['showDateTime'])
        df['bookingDate'] = pd.to_datetime(df['bookingDate'])
        df['hour'] = df['showDateTime'].dt.hour
        df['dayOfWeek'] = df['showDateTime'].dt.dayofweek
        df['month'] = df['showDateTime'].dt.month

        insights = []
        patterns = {}

        # 1. Peak hours analysis
        hourly_bookings = df.groupby('hour')['totalPrice'].agg(['sum', 'count'])
        peak_hours = hourly_bookings.nlargest(3, 'sum').index.tolist()
        patterns['peak_hours'] = peak_hours
        insights.append(f"🕐 Peak booking hours: {', '.join([f'{h}:00' for h in peak_hours])}")

        # 2. Day of week analysis
        daily_revenue = df.groupby('dayOfWeek')['totalPrice'].sum()
        best_days = daily_revenue.nlargest(3).index.tolist()
        day_names = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        patterns['best_days'] = [day_names[d] for d in best_days]
        insights.append(f"📅 Best performing days: {', '.join(patterns['best_days'])}")

        # 3. Genre popularity
        genre_counts = df.explode('genreIds')['genreIds'].value_counts().head(5)
        patterns['popular_genres'] = genre_counts.index.tolist()
        insights.append(f"🎬 Top genres: IDs {', '.join(map(str, patterns['popular_genres'][:3]))}")

        # 4. Average booking lead time
        df['lead_time'] = (df['showDateTime'] - df['bookingDate']).dt.days
        avg_lead = df['lead_time'].mean()
        patterns['avg_lead_time_days'] = round(avg_lead, 1)
        insights.append(f"⏰ Average booking lead time: {patterns['avg_lead_time_days']} days")

        # 5. Revenue trends
        df['date'] = df['showDateTime'].dt.date
        daily_trend = df.groupby('date')['totalPrice'].sum()
        recent_trend = daily_trend.tail(7).pct_change().mean()
        trend_direction = "increasing" if recent_trend > 0.05 else "decreasing" if recent_trend < -0.05 else "stable"
        patterns['revenue_trend'] = trend_direction
        insights.append(f"📈 Revenue trend (last 7 days): {trend_direction}")

        # 6. Occupancy analysis
        avg_occupancy = df['seatCount'].mean()
        patterns['avg_seats_per_booking'] = round(avg_occupancy, 2)
        insights.append(f"👥 Average seats per booking: {patterns['avg_seats_per_booking']}")

        # Recommendations based on patterns
        recommendations = self._generate_recommendations(patterns, df)

        return {
            "insights": insights,
            "patterns": patterns,
            "recommendations": recommendations,
            "total_revenue": float(df['totalPrice'].sum()),
            "total_bookings": len(df),
            "average_ticket_price": float(df['totalPrice'].mean())
        }

    def _generate_recommendations(self, patterns: Dict, df: pd.DataFrame) -> List[str]:
        """Generate actionable recommendations"""
        recommendations = []

        # Recommendation 1: Schedule optimization
        if patterns.get('peak_hours'):
            recommendations.append(
                f"💡 Schedule more shows during peak hours ({', '.join([f'{h}:00' for h in patterns['peak_hours'][:2]])}) "
                f"to maximize revenue"
            )

        # Recommendation 2: Weekend strategy
        if 'Saturday' in patterns.get('best_days', []) or 'Sunday' in patterns.get('best_days', []):
            recommendations.append(
                "💡 Increase weekend show capacity - these are your highest revenue days"
            )

        # Recommendation 3: Popular genres
        if patterns.get('popular_genres'):
            recommendations.append(
                f"💡 Prioritize movies in top-performing genres (IDs: {', '.join(map(str, patterns['popular_genres'][:3]))})"
            )

        # Recommendation 4: Lead time optimization
        if patterns.get('avg_lead_time_days', 0) < 2:
            recommendations.append(
                "💡 Consider advance promotions - most bookings are made close to showtime"
            )

        # Recommendation 5: Revenue trend
        if patterns.get('revenue_trend') == 'decreasing':
            recommendations.append(
                "⚠️ Revenue declining - consider promotional campaigns or schedule adjustments"
            )
        elif patterns.get('revenue_trend') == 'increasing':
            recommendations.append(
                "✅ Revenue growing - maintain current strategy and consider expanding capacity"
            )

        return recommendations

