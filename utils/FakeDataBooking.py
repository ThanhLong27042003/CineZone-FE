#!/usr/bin/env python3
"""
Seed bookings + bookingdetails into your cinezonedb (MySQL).
Designed for the provided schema (tables: `user`, `shows`, `bookings`, `bookingdetails`, `seat_instances`, `seat`).

Usage:
  - Edit DB_URL below if needed, or set env var DB_URL.
  - Run: python seed_cinezonedb.py
"""
import os
import sys
import uuid
import random
from datetime import datetime, timedelta
from decimal import Decimal
from faker import Faker

from sqlalchemy import create_engine, text
from sqlalchemy.exc import SQLAlchemyError

fake = Faker()
random.seed(42)

# ---------- CONFIG ----------
DB_URL = os.environ.get("DB_URL", "mysql+pymysql://root:@localhost:3306/cinezonedb")
TOTAL_BOOKINGS = int(os.environ.get("TOTAL_BOOKINGS", "5000"))
BATCH_SIZE = int(os.environ.get("BATCH_SIZE", "100"))
# ----------------------------

def log(*args, **kwargs):
    print(*args, **kwargs)
    sys.stdout.flush()

def ensure_conn(engine):
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return True
    except Exception as e:
        log("DB connection failed:", e)
        return False

def load_users_and_shows(engine):
    with engine.connect() as conn:
        users = conn.execute(text("SELECT `id` FROM `user`")).fetchall()
        shows = conn.execute(text("SELECT `showid`, `price` FROM `shows`")).fetchall()
    users = [u[0] for u in users]
    # price -> Decimal
    shows = [(int(s[0]), Decimal(str(s[1]))) for s in shows]
    return users, shows

def load_available_seat_instances(engine):
    """
    Returns dict: showid -> list of dict {seat_instanceid, seatid, seat_number}
    Only includes seat_instances.status = 'AVAILABLE'
    """
    with engine.connect() as conn:
        rows = conn.execute(text(
            "SELECT si.seat_instanceid, si.showid, si.seatid, s.seat_number "
            "FROM `seat_instances` si "
            "JOIN `seat` s ON si.seatid = s.seatid "
            "WHERE si.status = 'AVAILABLE'"
        )).fetchall()
    mapping = {}
    for r in rows:
        siid, showid, seatid, seat_number = r
        mapping.setdefault(int(showid), []).append({
            "seat_instanceid": int(siid),
            "seatid": int(seatid),
            "seat_number": seat_number
        })
    return mapping

def random_payment():
    return random.choice(["PAYPAL", "VNPAY"])

def random_status():
    return random.choice(["PENDING", "CONFIRMED", "CANCELLED"])

def random_seat_fallback():
    row = chr(ord('A') + random.randint(0, 9))
    num = random.randint(1, 9)
    return f"{row}{num}"

def chunked(iterable, n):
    it = list(iterable)
    for i in range(0, len(it), n):
        yield it[i:i+n]

def main():
    log("DB_URL =", DB_URL)
    engine = create_engine(DB_URL, pool_pre_ping=True, pool_size=10, max_overflow=20)

    if not ensure_conn(engine):
        log("Cannot connect to DB. Check DB_URL, user/password and that MySQL server is running.")
        return

    users, shows = load_users_and_shows(engine)
    if not users:
        log("No users found in table `user`. Seed users first.")
        return
    if not shows:
        log("No shows found in table `shows`. Seed shows first.")
        return

    log(f"Loaded {len(users)} users and {len(shows)} shows.")

    # Preload seat instances available
    seat_instances_map = {}
    try:
        seat_instances_map = load_available_seat_instances(engine)
        total_seat_instances = sum(len(v) for v in seat_instances_map.values())
        log(f"Loaded seat_instances AVAILABLE: {total_seat_instances}")
    except Exception:
        log("Warning: couldn't load seat_instances (table may be empty). Continuing with fallback seats.")

    inserted = 0
    batch = []
    order_ids_batch = []

    try:
        with engine.begin() as conn:  # transaction per run loop; we will commit per batch below
            pass  # just to ensure connectivity and autocommit behavior ok
    except Exception as e:
        log("Error starting transaction:", e)
        return

    i = 0
    while i < TOTAL_BOOKINGS:
        batch.clear()
        order_ids_batch.clear()
        batch_count = min(BATCH_SIZE, TOTAL_BOOKINGS - i)
        for _ in range(batch_count):
            user_id = random.choice(users)
            showid, price = random.choice(shows)
            seats_count = random.randint(1, 5)
            total_price = int((price * seats_count).quantize(Decimal('1')))  # store as integer (schema has bigint)
            order_id = str(uuid.uuid4())

            booking_date = datetime.now() - timedelta(days=random.randint(0, 30), seconds=random.randint(0,86400))
            booking_row = {
                "id": user_id,
                "showid": showid,
                "booking_date": booking_date,
                "order_id": order_id,
                "payment_method": random_payment(),
                "total_price": total_price,
                "status": random_status()
            }
            batch.append(booking_row)
            order_ids_batch.append(order_id)

        # Insert bookings in batch
        try:
            with engine.begin() as conn:
                insert_sql = text(
                    "INSERT INTO `bookings` (`id`,`showid`,`booking_date`,`order_id`,`payment_method`,`total_price`,`status`) "
                    "VALUES (:id, :showid, :booking_date, :order_id, :payment_method, :total_price, :status)"
                )
                conn.execute(insert_sql, batch)

                # SELECT back the inserted bookings to get bookingid
                select_sql = text(
                    "SELECT `bookingid`, `order_id`, `showid`, `total_price` FROM `bookings` WHERE `order_id` IN :order_ids"
                )
                # SQLAlchemy requires a tuple for IN clause
                rows = conn.execute(select_sql, {"order_ids": tuple(order_ids_batch)}).mappings().all()
                mapping = {r["order_id"]: {"bookingid": int(r["bookingid"]), "showid": int(r["showid"]), "total_price": int(r["total_price"])} for r in rows}

                

                # Prepare bookingdetails
                details = []
                seat_instance_updates = []
                for b in batch:
                    od = b["order_id"]
                    if od not in mapping:
                        log("Warning: inserted booking not found by order_id:", od)
                        continue
                    bid = mapping[od]["bookingid"]
                    showid = mapping[od]["showid"]
                    total_price = mapping[od]["total_price"]
                    seats_to_create = random.randint(1, 5)
                    # Try to use available seat_instances for this show if any
                    available_list = seat_instances_map.get(showid, [])
                    for sindex in range(seats_to_create):
                        seat_number = None
                        seat_instance_selected = None
                        # pop an available seat_instance if present
                        if available_list:
                            seat_instance_selected = available_list.pop()  # get one
                            # attempt to atomically update it to BOOKED
                            upd = conn.execute(text(
                                "UPDATE `seat_instances` SET `status` = 'BOOKED', `hold_expires_at` = NULL WHERE `seat_instanceid` = :siid AND `status` = 'AVAILABLE'"
                            ), {"siid": seat_instance_selected["seat_instanceid"]})
                            if upd.rowcount > 0:
                                seat_number = seat_instance_selected["seat_number"]
                            else:
                                # someone else booked it or concurrent issue -> fallback to random seat
                                seat_number = random_seat_fallback()
                        else:
                            seat_number = random_seat_fallback()

                        # price per seat (split evenly)
                        price_per_seat = float(total_price) / seats_to_create if seats_to_create else float(total_price)
                        details.append({
                            "bookingid": bid,
                            "seat_number": seat_number,
                            "price": round(price_per_seat, 2)
                        })

                # Bulk insert bookingdetails
                if details:
                    insert_det_sql = text(
                        "INSERT INTO `bookingdetails` (`bookingid`,`seat_number`,`price`) VALUES (:bookingid, :seat_number, :price)"
                    )
                    conn.execute(insert_det_sql, details)

            inserted += len(batch)
            i += len(batch)
            log(f"Inserted bookings: {inserted}/{TOTAL_BOOKINGS}")
        except SQLAlchemyError as e:
            log("Batch insert error:", e)
            # Try to log and abort
            raise

    log("DONE seeding bookings. Total inserted:", inserted)
    log("Note: bookingdetails inserted per booking; seat_instances updated where available.")
    log("If you want to skip seat_instance updates, adjust script to not run UPDATE on `seat_instances`.")

if __name__ == "__main__":
    main()
