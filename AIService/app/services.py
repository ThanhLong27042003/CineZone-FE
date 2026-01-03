from .revenue import RevenueAnalyzer
from .scheduler import ScheduleOptimizer

# Initialize services
revenue_analyzer = RevenueAnalyzer()
schedule_optimizer = ScheduleOptimizer()

# Export for use in routers
__all__ = ['revenue_analyzer', 'schedule_optimizer']