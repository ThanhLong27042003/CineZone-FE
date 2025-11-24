# import sys
# sys.stdout.reconfigure(encoding='utf-8')
# import sys
# import time
# import requests
# import mysql.connector
# from mysql.connector import errorcode
# import random
# from datetime import datetime, date, time as dtime, timedelta
# import math

# # ---------------- CONFIG ----------------
# TMDB_API_KEY = "0ae7ede8c76c4663f8fb43e3813fc697"   # <-- set this
# DB_CONFIG = {
#     "host": "127.0.0.1",
#     "user": "root",
#     "password": "",                  # <-- set your password
#     "database": "cinezonedb",
#     "port": 3306,
#     "raise_on_warnings": True,
# }
# TARGET_PAGES = 100       # pages per endpoint (20 items/page)
# SLEEP_BETWEEN_REQUESTS = 0.25
# BATCH_COMMIT = 20

# # ----- Shows configuration -----
# SHOWS_PER_MOVIE_MIN = 10   # min number of shows to create per movie
# SHOWS_PER_MOVIE_MAX = 15   # max number of shows to create per movie
# SHOW_DAYS_SPAN = 28        # spread shows across this many days starting from base_date
# SHOW_TIME_SLOTS = [
#     dtime(9, 30),
#     dtime(11, 30),
#     dtime(13, 30),
#     dtime(15, 30),
#     dtime(17, 30),
#     dtime(19, 30),
#     dtime(21, 30),
# ]                           # possible time slots
# PRICE_MIN = 50.00
# PRICE_MAX = 150.00

# # per-day constraints
# SHOWS_PER_DAY_MIN = 5
# SHOWS_PER_DAY_MAX = 10
# # --------------------------------

# # Filtering
# MIN_VOTE_AVERAGE = 0
# MIN_VOTE_COUNT = 0
# MIN_POPULARITY = 0
# # ALLOWED_COUNTRIES = {"US", "JP", "KR", "CN", "VN"}  # allowed production_countries
# ALLOWED_COUNTRIES = {"VN"} 
# # TMDB
# TMDB_BASE = "https://api.themoviedb.org/3"
# TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/original"
# SESSION = requests.Session()
# SESSION.params = {"api_key": TMDB_API_KEY, "language": "en-US"}
# # ----------------------------------------

# # Ensure console prints unicode on Windows
# try:
#     sys.stdout.reconfigure(encoding="utf-8")
# except Exception:
#     try:
#         import io
#         sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
#     except Exception:
#         pass


# def tmdb_get(path, params=None, max_retries=3):
#     if params is None:
#         params = {}
#     url = TMDB_BASE + path
#     for attempt in range(1, max_retries + 1):
#         try:
#             resp = SESSION.get(url, params=params, timeout=15)
#             if resp.status_code == 200:
#                 return resp.json()
#             if resp.status_code == 429:
#                 retry_after = int(resp.headers.get("Retry-After", "3"))
#                 print(f"[TMDB] Rate limited. Sleeping {retry_after}s...")
#                 time.sleep(retry_after)
#             else:
#                 print(f"[TMDB] HTTP {resp.status_code} for {url} (attempt {attempt})")
#         except requests.RequestException as e:
#             print(f"[TMDB] Request error: {e} (attempt {attempt})")
#         time.sleep(0.5 * attempt)
#     raise RuntimeError(f"Failed to fetch {url}")


# def collect_ids_from_endpoint(endpoint, pages=TARGET_PAGES):
#     ids = []
#     for page in range(1, pages + 1):
#         data = tmdb_get(f"/movie/{endpoint}", params={"page": page})
#         for r in data.get("results", []):
#             ids.append(r.get("id"))
#         time.sleep(SLEEP_BETWEEN_REQUESTS)
#     print(f"[INFO] Collected {len(ids)} ids from {endpoint}")
#     return ids


# def collect_ids_from_provider(provider_id=8, region='VN', pages=TARGET_PAGES):
#     ids = []
#     for page in range(1, pages + 1):
#         params = {"with_watch_providers": provider_id, "watch_region": region, "page": page}
#         data = tmdb_get("/discover/movie", params=params)
#         for r in data.get("results", []):
#             ids.append(r.get("id"))
#         time.sleep(SLEEP_BETWEEN_REQUESTS)
#     print(f"[INFO] Collected {len(ids)} ids from provider_id={provider_id} region={region}")
#     return ids


# def fetch_movie_detail_and_credits(mid):
#     d = tmdb_get(f"/movie/{mid}")
#     credits = tmdb_get(f"/movie/{mid}/credits")
#     va = d.get("vote_average")
#     vote_average = round(float(va), 1) if va is not None else None
#     poster = (TMDB_IMAGE_BASE + d["poster_path"]) if d.get("poster_path") else None
#     backdrop = (TMDB_IMAGE_BASE + d["backdrop_path"]) if d.get("backdrop_path") else None
#     return {
#         "title": d.get("title") or d.get("original_title"),
#         "overview": d.get("overview"),
#         "release_date": d.get("release_date") or None,
#         "runtime": d.get("runtime"),
#         "poster_path": poster,
#         "backdrop_path": backdrop,
#         "vote_average": vote_average,
#         "vote_count": int(d.get("vote_count") or 0),
#         "popularity": float(d.get("popularity") or 0.0),
#         "production_countries": d.get("production_countries", []),
#         "genres": d.get("genres", []),
#         "casts": credits.get("cast", [])[:10] if credits else []
#     }, d

# # ---------------- DB helpers ----------------
# def connect_db(cfg):
#     return mysql.connector.connect(**cfg)


# def movie_exists(cursor, title, release_date):
#     if not title:
#         return False
#     if release_date:
#         cursor.execute("SELECT movieid FROM movies WHERE title=%s AND release_date=%s LIMIT 1", (title, release_date))
#     else:
#         cursor.execute("SELECT movieid FROM movies WHERE title=%s AND release_date IS NULL LIMIT 1", (title,))
#     return cursor.fetchone() is not None


# def insert_movie(cursor, m):
#     sql = ("INSERT INTO movies "
#            "(title, overview, release_date, runtime, poster_path, backdrop_path, vote_average, vote_count) "
#            "VALUES (%s,%s,%s,%s,%s,%s,%s,%s)")
#     cursor.execute(sql, (
#         m["title"], m["overview"], m["release_date"], m["runtime"],
#         m["poster_path"], m["backdrop_path"], m["vote_average"], m["vote_count"]
#     ))
#     return cursor.lastrowid


# def get_or_create_genre(cursor, name):
#     if not name:
#         return None
#     cursor.execute("SELECT genreid FROM genres WHERE name=%s LIMIT 1", (name,))
#     row = cursor.fetchone()
#     if row:
#         return row[0]
#     cursor.execute("INSERT INTO genres (name) VALUES (%s)", (name,))
#     return cursor.lastrowid


# def link_movie_genre(cursor, movieid, genreid):
#     if genreid is None:
#         return
#     cursor.execute("INSERT IGNORE INTO moviegenres (movieid, genreid) VALUES (%s,%s)", (movieid, genreid))

# # ----- Country -> genre helpers -----
# EUROPEAN_ISOS = {
#     'AL','AD','AT','BY','BE','BA','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IS','IE','IT','LV','LI','LT','LU','MK','MT','MD','MC','ME','NL','NO','PL','PT','RO','RU','SM','RS','SK','SI','ES','SE','CH','UA','GB'
# }


# def map_country_to_genre_name(country):
#     if not country:
#         return None
#     iso = (country.get('iso_3166_1') or '').upper()
#     name = (country.get('name') or '').lower()

#     if iso == 'KR' or 'korea' in name:
#         return 'Korea'
#     if iso == 'JP' or 'japan' in name:
#         return 'Japan'
#     if iso == 'US' or 'united states' in name or 'america' in name or 'usa' in name:
#         return 'US'
#     if iso == 'CN' or 'china' in name:
#         return 'China'
#     if iso == 'VN' or 'vietnam' in name:
#         return 'Vietnam'

#     if iso in EUROPEAN_ISOS or any(eu in name for eu in ('europe','united kingdom','britain','england')):
#         return 'Europe'

#     if country.get('name'):
#         nm = country.get('name')
#         nm = nm.replace('Republic of ', '').replace('People\'s Republic of ', '').strip()
#         return nm
#     if iso:
#         return iso
#     return None


# def add_country_genres(cursor, movieid, production_countries):
#     if not production_countries:
#         return
#     added = set()
#     for c in production_countries:
#         gname = map_country_to_genre_name(c)
#         if not gname or gname in added:
#             continue
#         gid = get_or_create_genre(cursor, gname)
#         link_movie_genre(cursor, movieid, gid)
#         added.add(gname)


# def get_or_create_cast(cursor, name, profile_path):
#     if not name:
#         return None
#     cursor.execute("SELECT castid FROM casts WHERE name=%s LIMIT 1", (name,))
#     row = cursor.fetchone()
#     if row:
#         return row[0]
#     cursor.execute("INSERT INTO casts (name, profile_path) VALUES (%s,%s)", (name, profile_path))
#     return cursor.lastrowid


# def link_movie_cast(cursor, movieid, castid):
#     if castid is None:
#         return
#     cursor.execute("INSERT IGNORE INTO moviecasts (movieid, castid) VALUES (%s,%s)", (movieid, castid))

# # ---- Shows helpers ----
# def shows_exist(cursor, movieid):
#     cursor.execute("SELECT showid FROM shows WHERE movieid=%s LIMIT 1", (movieid,))
#     return cursor.fetchone() is not None


# def parse_release_date_or_none(release_date_str):
#     if not release_date_str:
#         return None
#     try:
#         return datetime.strptime(release_date_str, "%Y-%m-%d").date()
#     except Exception:
#         return None


# def random_future_date(min_year=2026, max_year=2028):
#     start = date(min_year, 1, 1)
#     end = date(max_year, 12, 31)
#     days = (end - start).days
#     return start + timedelta(days=random.randint(0, days))


# def get_future_base_date(release_date_str):
#     rd = parse_release_date_or_none(release_date_str)
#     if rd and rd.year >= 2026:
#         return rd
#     return random_future_date(2026, 2028)


# def expand_time_slots(time_slots, desired_count):
#     slots = sorted(time_slots)
#     if len(slots) >= desired_count:
#         return slots[:desired_count]
#     minutes = [t.hour * 60 + t.minute for t in slots]
#     increment = 60
#     cur = minutes[-1]
#     while len(minutes) < desired_count:
#         cur = (cur + increment) % (24 * 60)
#         if cur not in minutes:
#             minutes.append(cur)
#         else:
#             increment += 15
#     minutes = minutes[:desired_count]
#     return [dtime(m // 60, m % 60) for m in minutes]


# def create_shows_for_movie(cursor, movieid, base_date=None, n_shows=None,
#                            days_span=SHOW_DAYS_SPAN, time_slots=SHOW_TIME_SLOTS,
#                            price_min=PRICE_MIN, price_max=PRICE_MAX):
#     if shows_exist(cursor, movieid):
#         return 0

#     if base_date is None:
#         base_date = date.today()

#     if n_shows is None:
#         n_shows = random.randint(SHOWS_PER_MOVIE_MIN, SHOWS_PER_MOVIE_MAX)

#     if n_shows < SHOWS_PER_DAY_MIN:
#         n_shows = SHOWS_PER_DAY_MIN

#     max_capacity = (max(0, days_span) + 1) * SHOWS_PER_DAY_MAX
#     if n_shows > max_capacity:
#         n_shows = max_capacity

#     days_min = math.ceil(n_shows / SHOWS_PER_DAY_MAX)
#     days_max = min((days_span + 1), max(1, n_shows // SHOWS_PER_DAY_MIN))
#     if days_max < days_min:
#         days_max = days_min
#     active_days = random.randint(days_min, days_max)

#     per_day_counts = [SHOWS_PER_DAY_MIN] * active_days
#     remaining = n_shows - SHOWS_PER_DAY_MIN * active_days

#     indices = list(range(active_days))
#     random.shuffle(indices)
#     for i in indices:
#         if remaining <= 0:
#             break
#         cap = SHOWS_PER_DAY_MAX - SHOWS_PER_DAY_MIN
#         add = min(remaining, cap)
#         if add > 0:
#             extra = random.randint(0, add)
#             per_day_counts[i] += extra
#             remaining -= extra

#     idx = 0
#     while remaining > 0:
#         cap = SHOWS_PER_DAY_MAX - per_day_counts[idx]
#         if cap > 0:
#             take = min(cap, remaining)
#             per_day_counts[idx] += take
#             remaining -= take
#         idx = (idx + 1) % active_days

#     possible_offsets = list(range(0, days_span + 1))
#     if active_days > len(possible_offsets):
#         active_offsets = possible_offsets[:]
#     else:
#         active_offsets = random.sample(possible_offsets, k=active_days)
#     active_offsets.sort()

#     slots_expanded = expand_time_slots(time_slots, max(SHOWS_PER_DAY_MAX, len(time_slots)))

#     inserted = 0
#     for day_offset, count in zip(active_offsets, per_day_counts):
#         chosen_date = base_date + timedelta(days=day_offset)
#         if count > len(slots_expanded):
#             slots_for_day = slots_expanded[:count]
#         else:
#             slots_for_day = random.sample(slots_expanded, count)
#         for t in slots_for_day:
#             show_dt = datetime.combine(chosen_date, t)
#             price = round(random.uniform(price_min, price_max), 2)
#             cursor.execute(
#                 "INSERT INTO shows (movieid, show_date_time, price) VALUES (%s, %s, %s)",
#                 (movieid, show_dt.strftime("%Y-%m-%d %H:%M:%S"), price)
#             )
#             inserted += 1
#     return inserted

# # -------------- Validation --------------
# def is_allowed_country(raw_production_countries):
#     codes = {c.get("iso_3166_1") for c in raw_production_countries if c.get("iso_3166_1")}
#     return not ALLOWED_COUNTRIES.isdisjoint(codes)


# def passes_quality_checks(detail):
#     if (detail["vote_average"] is None) or (detail["vote_average"] < MIN_VOTE_AVERAGE):
#         return False
#     if detail["vote_count"] < MIN_VOTE_COUNT:
#         return False
#     if detail["popularity"] < MIN_POPULARITY:
#         return False
#     return True

# # ---------------- Main ----------------
# def main():
#     if TMDB_API_KEY == "YOUR_TMDB_API_KEY":
#         print("ERROR: set TMDB_API_KEY in the script")
#         return

#     ids = []
#     ids += collect_ids_from_endpoint("now_playing", TARGET_PAGES)
#     ids += collect_ids_from_endpoint("upcoming", TARGET_PAGES)
#     print(f"[INFO] Total ids collected: {len(ids)}")

#     cnx = connect_db(DB_CONFIG)
#     cursor = cnx.cursor()

#     inserted = 0
#     skipped = 0
#     errors = 0
#     try:
#         for idx, mid in enumerate(ids, start=1):
#             try:
#                 detail, raw_full = fetch_movie_detail_and_credits(mid)
#                 # country check
#                 if not is_allowed_country(detail["production_countries"]):
#                     skipped += 1
#                     continue
#                 # quality check
#                 if not passes_quality_checks(detail):
#                     skipped += 1
#                     continue
#                 # ensure release_date is at least 2026 or later
#                 base_date = get_future_base_date(detail.get("release_date"))
#                 # if original release_date was before 2026 or missing, overwrite so DB stores a future release date
#                 parsed_original = parse_release_date_or_none(detail.get("release_date"))
#                 if not parsed_original or parsed_original.year < 2026:
#                     detail["release_date"] = base_date.strftime("%Y-%m-%d")

#                 # avoid duplicates (use possibly-updated release_date)
#                 if movie_exists(cursor, detail["title"], detail["release_date"]):
#                     skipped += 1
#                     continue
#                 # insert movie
#                 movieid = insert_movie(cursor, detail)
#                 # genres: name-based
#                 for g in detail["genres"]:
#                     gname = g.get("name")
#                     gid = get_or_create_genre(cursor, gname)
#                     link_movie_genre(cursor, movieid, gid)

#                 # --- NEW: add country-as-genre (JP->Japan, KR->Korea, US->US, CN->China, VN->Vietnam, EU->Europe) ---
#                 add_country_genres(cursor, movieid, detail["production_countries"])
#                 # -----------------------------------------------------------------------------------------------------

#                 # casts: name-based, store profile_path if available
#                 for c in detail["casts"]:
#                     cname = c.get("name")
#                     profile_path = (TMDB_IMAGE_BASE + c.get("profile_path")) if c.get("profile_path") else None
#                     cid = get_or_create_cast(cursor, cname, profile_path)
#                     link_movie_cast(cursor, movieid, cid)

#                 # ----- TẠO NHIỀU SHOWS CHO PHIM NÀY (10-15 shows, trải nhiều ngày) -----
#                 shows_created = create_shows_for_movie(cursor, movieid, base_date=base_date)
#                 if shows_created:
#                     print(f"[INFO] Created {shows_created} shows for movieid={movieid} ({detail['title']})")
#                 # ----------------------------------

#                 inserted += 1
#                 if idx % BATCH_COMMIT == 0:
#                     cnx.commit()
#                     print(f"[COMMIT] {idx}/{len(ids)} processed, inserted so far: {inserted}")
#                 # polite delay
#                 time.sleep(SLEEP_BETWEEN_REQUESTS)
#             except Exception as e:
#                 print(f"[ERR] Movie {mid}: {e}")
#                 errors += 1
#                 # small pause on error
#                 time.sleep(1)
#         cnx.commit()
#         print(f"[DONE] Inserted: {inserted}, Skipped: {skipped}, Errors: {errors}")
#     finally:
#         cursor.close()
#         cnx.close()

# if __name__ == "__main__":
#     main()











































# import sys
# import time
# import requests
# import mysql.connector
# import random
# from datetime import datetime, date, time as dtime, timedelta
# import math

# # ---------------- CONFIG ----------------
# TMDB_API_KEY = "0ae7ede8c76c4663f8fb43e3813fc697"   # <-- set this
# DB_CONFIG = {
#     "host": "127.0.0.1",
#     "user": "root",
#     "password": "",                  # <-- set your password
#     "database": "cinezonedb",
#     "port": 3306,
#     "raise_on_warnings": True,
# }
# TARGET_PAGES = 3        # số trang cần lấy (mỗi trang 20 phim)
# SLEEP_BETWEEN_REQUESTS = 0.25
# BATCH_COMMIT = 20

# # ----- Shows configuration -----
# SHOWS_PER_MOVIE_MIN = 10
# SHOWS_PER_MOVIE_MAX = 15
# SHOW_DAYS_SPAN = 28
# SHOW_TIME_SLOTS = [
#     dtime(9, 30),
#     dtime(11, 30),
#     dtime(13, 30),
#     dtime(15, 30),
#     dtime(17, 30),
#     dtime(19, 30),
#     dtime(21, 30),
# ]
# PRICE_MIN = 50.00
# PRICE_MAX = 150.00

# SHOWS_PER_DAY_MIN = 5
# SHOWS_PER_DAY_MAX = 10
# # --------------------------------

# # Filtering
# MIN_VOTE_AVERAGE = 0.0
# MIN_VOTE_COUNT = 0.0
# MIN_POPULARITY = 0.0

# # TMDB
# TMDB_BASE = "https://api.themoviedb.org/3"
# TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/original"
# SESSION = requests.Session()
# SESSION.params = {"api_key": TMDB_API_KEY, "language": "vi-VN"}  # trả về tiếng Việt
# # ----------------------------------------

# # Map genres Vietnamese -> English
# GENRE_TRANSLATION = {
#     "Hành động": "Action",
#     "Phiêu lưu": "Adventure",
#     "Hoạt hình": "Animation",
#     "Hài": "Comedy",
#     "Tội phạm": "Crime",
#     "Tài liệu": "Documentary",
#     "Chính kịch": "Drama",
#     "Gia đình": "Family",
#     "Giả tưởng": "Fantasy",
#     "Lịch sử": "History",
#     "Kinh dị": "Horror",
#     "Âm nhạc": "Music",
#     "Bí ẩn": "Mystery",
#     "Lãng mạn": "Romance",
#     "Khoa học viễn tưởng": "Science Fiction",
#     "Phim truyền hình": "TV Movie",
#     "Kinh điển": "Thriller",
#     "Chiến tranh": "War",
#     "Miền Tây": "Western",
# }

# # Ensure console prints unicode on Windows
# try:
#     sys.stdout.reconfigure(encoding="utf-8")
# except Exception:
#     try:
#         import io
#         sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
#     except Exception:
#         pass


# def tmdb_get(path, params=None, max_retries=3):
#     if params is None:
#         params = {}
#     url = TMDB_BASE + path
#     for attempt in range(1, max_retries + 1):
#         try:
#             resp = SESSION.get(url, params=params, timeout=15)
#             if resp.status_code == 200:
#                 return resp.json()
#             if resp.status_code == 429:
#                 retry_after = int(resp.headers.get("Retry-After", "3"))
#                 print(f"[TMDB] Rate limited. Sleeping {retry_after}s...")
#                 time.sleep(retry_after)
#             else:
#                 print(f"[TMDB] HTTP {resp.status_code} for {url} (attempt {attempt})")
#         except requests.RequestException as e:
#             print(f"[TMDB] Request error: {e} (attempt {attempt})")
#         time.sleep(0.5 * attempt)
#     raise RuntimeError(f"Failed to fetch {url}")


# # ---- Chỉ lấy phim Việt Nam
# def collect_ids_vietnam(pages=TARGET_PAGES):
#     ids = []
#     for page in range(1, pages + 1):
#         params = {"with_origin_country": "VN", "page": page}
#         data = tmdb_get("/discover/movie", params=params)
#         for r in data.get("results", []):
#             ids.append(r.get("id"))
#         time.sleep(SLEEP_BETWEEN_REQUESTS)
#     print(f"[INFO] Collected {len(ids)} VN movie ids")
#     return ids


# def fetch_movie_detail_and_credits(mid):
#     d = tmdb_get(f"/movie/{mid}")
#     credits = tmdb_get(f"/movie/{mid}/credits")
#     va = d.get("vote_average")
#     vote_average = round(float(va), 1) if va is not None else None
#     poster = (TMDB_IMAGE_BASE + d["poster_path"]) if d.get("poster_path") else None
#     backdrop = (TMDB_IMAGE_BASE + d["backdrop_path"]) if d.get("backdrop_path") else None
#     return {
#         "title": d.get("title") or d.get("original_title"),
#         "overview": d.get("overview"),
#         "release_date": d.get("release_date") or None,
#         "runtime": d.get("runtime"),
#         "poster_path": poster,
#         "backdrop_path": backdrop,
#         "vote_average": vote_average,
#         "vote_count": int(d.get("vote_count") or 0),
#         "popularity": float(d.get("popularity") or 0.0),
#         "production_countries": d.get("production_countries", []),
#         "genres": d.get("genres", []),
#         "casts": credits.get("cast", [])[:10] if credits else []
#     }, d

# # ---------------- DB helpers ----------------
# def connect_db(cfg):
#     return mysql.connector.connect(**cfg)


# def movie_exists(cursor, title, release_date):
#     if not title:
#         return False
#     if release_date:
#         cursor.execute("SELECT movieid FROM movies WHERE title=%s AND release_date=%s LIMIT 1", (title, release_date))
#     else:
#         cursor.execute("SELECT movieid FROM movies WHERE title=%s AND release_date IS NULL LIMIT 1", (title,))
#     return cursor.fetchone() is not None


# def insert_movie(cursor, m):
#     sql = ("INSERT INTO movies "
#            "(title, overview, release_date, runtime, poster_path, backdrop_path, vote_average, vote_count) "
#            "VALUES (%s,%s,%s,%s,%s,%s,%s,%s)")
#     cursor.execute(sql, (
#         m["title"], m["overview"], m["release_date"], m["runtime"],
#         m["poster_path"], m["backdrop_path"], m["vote_average"], m["vote_count"]
#     ))
#     return cursor.lastrowid


# def get_or_create_genre(cursor, name):
#     if not name:
#         return None
#     cursor.execute("SELECT genreid FROM genres WHERE name=%s LIMIT 1", (name,))
#     row = cursor.fetchone()
#     if row:
#         return row[0]
#     cursor.execute("INSERT INTO genres (name) VALUES (%s)", (name,))
#     return cursor.lastrowid


# def link_movie_genre(cursor, movieid, genreid):
#     if genreid is None:
#         return
#     cursor.execute("INSERT IGNORE INTO moviegenres (movieid, genreid) VALUES (%s,%s)", (movieid, genreid))


# def get_or_create_cast(cursor, name, profile_path):
#     if not name:
#         return None
#     cursor.execute("SELECT castid FROM casts WHERE name=%s LIMIT 1", (name,))
#     row = cursor.fetchone()
#     if row:
#         return row[0]
#     cursor.execute("INSERT INTO casts (name, profile_path) VALUES (%s,%s)", (name, profile_path))
#     return cursor.lastrowid


# def link_movie_cast(cursor, movieid, castid):
#     if castid is None:
#         return
#     cursor.execute("INSERT IGNORE INTO moviecasts (movieid, castid) VALUES (%s,%s)", (movieid, castid))

# # ---- Shows helpers ----
# def shows_exist(cursor, movieid):
#     cursor.execute("SELECT showid FROM shows WHERE movieid=%s LIMIT 1", (movieid,))
#     return cursor.fetchone() is not None


# def parse_release_date_or_none(release_date_str):
#     if not release_date_str:
#         return None
#     try:
#         return datetime.strptime(release_date_str, "%Y-%m-%d").date()
#     except Exception:
#         return None


# def random_future_date(min_year=2026, max_year=2028):
#     start = date(min_year, 1, 1)
#     end = date(max_year, 12, 31)
#     days = (end - start).days
#     return start + timedelta(days=random.randint(0, days))


# def get_future_base_date(release_date_str):
#     rd = parse_release_date_or_none(release_date_str)
#     if rd and rd.year >= 2026:
#         return rd
#     return random_future_date(2026, 2028)


# def expand_time_slots(time_slots, desired_count):
#     slots = sorted(time_slots)
#     if len(slots) >= desired_count:
#         return slots[:desired_count]
#     minutes = [t.hour * 60 + t.minute for t in slots]
#     increment = 60
#     cur = minutes[-1]
#     while len(minutes) < desired_count:
#         cur = (cur + increment) % (24 * 60)
#         if cur not in minutes:
#             minutes.append(cur)
#         else:
#             increment += 15
#     minutes = minutes[:desired_count]
#     return [dtime(m // 60, m % 60) for m in minutes]


# def create_shows_for_movie(cursor, movieid, base_date=None, n_shows=None,
#                            days_span=SHOW_DAYS_SPAN, time_slots=SHOW_TIME_SLOTS,
#                            price_min=PRICE_MIN, price_max=PRICE_MAX):
#     if shows_exist(cursor, movieid):
#         return 0

#     if base_date is None:
#         base_date = date.today()

#     if n_shows is None:
#         n_shows = random.randint(SHOWS_PER_MOVIE_MIN, SHOWS_PER_MOVIE_MAX)

#     if n_shows < SHOWS_PER_DAY_MIN:
#         n_shows = SHOWS_PER_DAY_MIN

#     max_capacity = (max(0, days_span) + 1) * SHOWS_PER_DAY_MAX
#     if n_shows > max_capacity:
#         n_shows = max_capacity

#     days_min = math.ceil(n_shows / SHOWS_PER_DAY_MAX)
#     days_max = min((days_span + 1), max(1, n_shows // SHOWS_PER_DAY_MIN))
#     if days_max < days_min:
#         days_max = days_min
#     active_days = random.randint(days_min, days_max)

#     per_day_counts = [SHOWS_PER_DAY_MIN] * active_days
#     remaining = n_shows - SHOWS_PER_DAY_MIN * active_days

#     indices = list(range(active_days))
#     random.shuffle(indices)
#     for i in indices:
#         if remaining <= 0:
#             break
#         cap = SHOWS_PER_DAY_MAX - SHOWS_PER_DAY_MIN
#         add = min(remaining, cap)
#         if add > 0:
#             extra = random.randint(0, add)
#             per_day_counts[i] += extra
#             remaining -= extra

#     idx = 0
#     while remaining > 0:
#         cap = SHOWS_PER_DAY_MAX - per_day_counts[idx]
#         if cap > 0:
#             take = min(cap, remaining)
#             per_day_counts[idx] += take
#             remaining -= take
#         idx = (idx + 1) % active_days

#     possible_offsets = list(range(0, days_span + 1))
#     if active_days > len(possible_offsets):
#         active_offsets = possible_offsets[:]
#     else:
#         active_offsets = random.sample(possible_offsets, k=active_days)
#     active_offsets.sort()

#     slots_expanded = expand_time_slots(time_slots, max(SHOWS_PER_DAY_MAX, len(time_slots)))

#     inserted = 0
#     for day_offset, count in zip(active_offsets, per_day_counts):
#         chosen_date = base_date + timedelta(days=day_offset)
#         if count > len(slots_expanded):
#             slots_for_day = slots_expanded[:count]
#         else:
#             slots_for_day = random.sample(slots_expanded, count)
#         for t in slots_for_day:
#             show_dt = datetime.combine(chosen_date, t)
#             price = round(random.uniform(price_min, price_max), 2)
#             cursor.execute(
#                 "INSERT INTO shows (movieid, show_date_time, price) VALUES (%s, %s, %s)",
#                 (movieid, show_dt.strftime("%Y-%m-%d %H:%M:%S"), price)
#             )
#             inserted += 1
#     return inserted

# # -------------- Validation --------------
# def passes_quality_checks(detail):
#     if (detail["vote_average"] is None) or (detail["vote_average"] < MIN_VOTE_AVERAGE):
#         return False
#     if detail["vote_count"] < MIN_VOTE_COUNT:
#         return False
#     if detail["popularity"] < MIN_POPULARITY:
#         return False
#     return True

# # ---------------- Main ----------------
# def main():
#     if TMDB_API_KEY == "YOUR_TMDB_API_KEY":
#         print("ERROR: set TMDB_API_KEY in the script")
#         return

#     # chỉ lấy phim VN
#     ids = collect_ids_vietnam(TARGET_PAGES)
#     print(f"[INFO] Total VN movie ids collected: {len(ids)}")

#     cnx = connect_db(DB_CONFIG)
#     cursor = cnx.cursor()

#     inserted = 0
#     skipped = 0
#     errors = 0
#     try:
#         for idx, mid in enumerate(ids, start=1):
#             try:
#                 detail, raw_full = fetch_movie_detail_and_credits(mid)
#                 # quality check
#                 if not passes_quality_checks(detail):
#                     skipped += 1
#                     continue
#                 # ensure release_date is at least 2026 or later
#                 base_date = get_future_base_date(detail.get("release_date"))
#                 parsed_original = parse_release_date_or_none(detail.get("release_date"))
#                 if not parsed_original or parsed_original.year < 2026:
#                     detail["release_date"] = base_date.strftime("%Y-%m-%d")

#                 # avoid duplicates
#                 if movie_exists(cursor, detail["title"], detail["release_date"]):
#                     skipped += 1
#                     continue

#                 # insert movie
#                 movieid = insert_movie(cursor, detail)

#                 # genres: dịch sang tiếng Anh nếu cần
#                 for g in detail["genres"]:
#                     gname = g.get("name")
#                     if not gname:
#                         continue
#                     if gname in GENRE_TRANSLATION:
#                         gname = GENRE_TRANSLATION[gname]
#                     gid = get_or_create_genre(cursor, gname)
#                     link_movie_genre(cursor, movieid, gid)

#                 # casts
#                 for c in detail["casts"]:
#                     cname = c.get("name")
#                     profile_path = (TMDB_IMAGE_BASE + c.get("profile_path")) if c.get("profile_path") else None
#                     cid = get_or_create_cast(cursor, cname, profile_path)
#                     link_movie_cast(cursor, movieid, cid)

#                 # shows
#                 shows_created = create_shows_for_movie(cursor, movieid, base_date=base_date)
#                 if shows_created:
#                     print(f"[INFO] Created {shows_created} shows for movieid={movieid} ({detail['title']})")

#                 inserted += 1
#                 if idx % BATCH_COMMIT == 0:
#                     cnx.commit()
#                     print(f"[COMMIT] {idx}/{len(ids)} processed, inserted so far: {inserted}")
#                 time.sleep(SLEEP_BETWEEN_REQUESTS)
#             except Exception as e:
#                 print(f"[ERR] Movie {mid}: {e}")
#                 errors += 1
#                 time.sleep(1)
#         cnx.commit()
#         print(f"[DONE] Inserted: {inserted}, Skipped: {skipped}, Errors: {errors}")
#     finally:
#         cursor.close()
#         cnx.close()

# if __name__ == "__main__":
#     main()



































# import sys
# sys.stdout.reconfigure(encoding='utf-8')
# import sys
# import time
# import requests
# import mysql.connector
# from mysql.connector import errorcode
# import random
# from datetime import datetime, date, time as dtime, timedelta
# import math

# # ---------------- CONFIG ----------------
# TMDB_API_KEY = "0ae7ede8c76c4663f8fb43e3813fc697"   # <-- set this
# DB_CONFIG = {
#     "host": "127.0.0.1",
#     "user": "root",
#     "password": "",                  # <-- set your password
#     "database": "cinezonedb",
#     "port": 3306,
#     "raise_on_warnings": True,
# }
# TARGET_PAGES = 4       # pages per endpoint (20 items/page)
# SLEEP_BETWEEN_REQUESTS = 0.25
# BATCH_COMMIT = 20

# # ----- Shows configuration -----
# SHOWS_PER_MOVIE_MIN = 10   # min number of shows to create per movie
# SHOWS_PER_MOVIE_MAX = 15   # max number of shows to create per movie
# SHOW_DAYS_SPAN = 28        # spread shows across this many days starting from base_date
# SHOW_TIME_SLOTS = [
#     dtime(9, 30),
#     dtime(11, 30),
#     dtime(13, 30),
#     dtime(15, 30),
#     dtime(17, 30),
#     dtime(19, 30),
#     dtime(21, 30),
# ]                           # possible time slots
# PRICE_MIN = 50.00
# PRICE_MAX = 150.00

# # per-day constraints
# SHOWS_PER_DAY_MIN = 5
# SHOWS_PER_DAY_MAX = 10
# # --------------------------------

# # Filtering
# MIN_VOTE_AVERAGE = 0
# MIN_VOTE_COUNT = 400
# MIN_POPULARITY = 5
# # ALLOWED_COUNTRIES = {"US", "JP", "KR", "CN", "VN"}  # allowed production_countries
# ALLOWED_COUNTRIES = {"CN"} 
# # TMDB
# TMDB_BASE = "https://api.themoviedb.org/3"
# TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/original"
# SESSION = requests.Session()
# SESSION.params = {"api_key": TMDB_API_KEY, "language": "en-US"}
# # ----------------------------------------

# # Ensure console prints unicode on Windows
# try:
#     sys.stdout.reconfigure(encoding="utf-8")
# except Exception:
#     try:
#         import io
#         sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
#     except Exception:
#         pass


# def tmdb_get(path, params=None, max_retries=3):
#     if params is None:
#         params = {}
#     url = TMDB_BASE + path
#     for attempt in range(1, max_retries + 1):
#         try:
#             resp = SESSION.get(url, params=params, timeout=15)
#             if resp.status_code == 200:
#                 return resp.json()
#             if resp.status_code == 429:
#                 retry_after = int(resp.headers.get("Retry-After", "3"))
#                 print(f"[TMDB] Rate limited. Sleeping {retry_after}s...")
#                 time.sleep(retry_after)
#             else:
#                 print(f"[TMDB] HTTP {resp.status_code} for {url} (attempt {attempt})")
#         except requests.RequestException as e:
#             print(f"[TMDB] Request error: {e} (attempt {attempt})")
#         time.sleep(0.5 * attempt)
#     raise RuntimeError(f"Failed to fetch {url}")


# def collect_korean_movies(pages=TARGET_PAGES):
#     ids = []
#     for page in range(1, pages + 1):
#         params = {
#             "with_original_language":"zh", 
#             "region": "CN",
#             "page": page
#         }
#         data = tmdb_get("/discover/movie", params=params)
#         for r in data.get("results", []):
#             ids.append(r.get("id"))
#         time.sleep(SLEEP_BETWEEN_REQUESTS)
#     print(f"[INFO] Collected {len(ids)} Korean movie ids")
#     return ids


# def collect_ids_from_provider(provider_id=8, region='VN', pages=TARGET_PAGES):
#     ids = []
#     for page in range(1, pages + 1):
#         params = {"with_watch_providers": provider_id, "watch_region": region, "page": page}
#         data = tmdb_get("/discover/movie", params=params)
#         for r in data.get("results", []):
#             ids.append(r.get("id"))
#         time.sleep(SLEEP_BETWEEN_REQUESTS)
#     print(f"[INFO] Collected {len(ids)} ids from provider_id={provider_id} region={region}")
#     return ids


# def fetch_movie_detail_and_credits(mid):
#     d = tmdb_get(f"/movie/{mid}")
#     credits = tmdb_get(f"/movie/{mid}/credits")
#     va = d.get("vote_average")
#     vote_average = round(float(va), 1) if va is not None else None
#     poster = (TMDB_IMAGE_BASE + d["poster_path"]) if d.get("poster_path") else None
#     backdrop = (TMDB_IMAGE_BASE + d["backdrop_path"]) if d.get("backdrop_path") else None
#     return {
#         "title": d.get("title") or d.get("original_title"),
#         "overview": d.get("overview"),
#         "release_date": d.get("release_date") or None,
#         "runtime": d.get("runtime"),
#         "poster_path": poster,
#         "backdrop_path": backdrop,
#         "vote_average": vote_average,
#         "vote_count": int(d.get("vote_count") or 0),
#         "popularity": float(d.get("popularity") or 0.0),
#         "production_countries": d.get("production_countries", []),
#         "genres": d.get("genres", []),
#         "casts": credits.get("cast", [])[:10] if credits else []
#     }, d

# # ---------------- DB helpers ----------------
# def connect_db(cfg):
#     return mysql.connector.connect(**cfg)


# def movie_exists(cursor, title, release_date):
#     if not title:
#         return False
#     if release_date:
#         cursor.execute("SELECT movieid FROM movies WHERE title=%s AND release_date=%s LIMIT 1", (title, release_date))
#     else:
#         cursor.execute("SELECT movieid FROM movies WHERE title=%s AND release_date IS NULL LIMIT 1", (title,))
#     return cursor.fetchone() is not None


# def insert_movie(cursor, m):
#     sql = ("INSERT INTO movies "
#            "(title, overview, release_date, runtime, poster_path, backdrop_path, vote_average, vote_count) "
#            "VALUES (%s,%s,%s,%s,%s,%s,%s,%s)")
#     cursor.execute(sql, (
#         m["title"], m["overview"], m["release_date"], m["runtime"],
#         m["poster_path"], m["backdrop_path"], m["vote_average"], m["vote_count"]
#     ))
#     return cursor.lastrowid


# def get_or_create_genre(cursor, name):
#     if not name:
#         return None
#     cursor.execute("SELECT genreid FROM genres WHERE name=%s LIMIT 1", (name,))
#     row = cursor.fetchone()
#     if row:
#         return row[0]
#     cursor.execute("INSERT INTO genres (name) VALUES (%s)", (name,))
#     return cursor.lastrowid


# def link_movie_genre(cursor, movieid, genreid):
#     if genreid is None:
#         return
#     cursor.execute("INSERT IGNORE INTO moviegenres (movieid, genreid) VALUES (%s,%s)", (movieid, genreid))

# # ----- Country -> genre helpers -----
# EUROPEAN_ISOS = {
#     'AL','AD','AT','BY','BE','BA','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IS','IE','IT','LV','LI','LT','LU','MK','MT','MD','MC','ME','NL','NO','PL','PT','RO','RU','SM','RS','SK','SI','ES','SE','CH','UA','GB'
# }


# def map_country_to_genre_name(country):
#     if not country:
#         return None
#     iso = (country.get('iso_3166_1') or '').upper()
#     name = (country.get('name') or '').lower()

#     if iso == 'KR' or 'korea' in name:
#         return 'Korea'
#     if iso == 'JP' or 'japan' in name:
#         return 'Japan'
#     if iso == 'US' or 'united states' in name or 'america' in name or 'usa' in name:
#         return 'US'
#     if iso == 'CN' or 'china' in name:
#         return 'China'
#     if iso == 'VN' or 'vietnam' in name:
#         return 'Vietnam'

#     if iso in EUROPEAN_ISOS or any(eu in name for eu in ('europe','united kingdom','britain','england')):
#         return 'Europe'

#     if country.get('name'):
#         nm = country.get('name')
#         nm = nm.replace('Republic of ', '').replace('People\'s Republic of ', '').strip()
#         return nm
#     if iso:
#         return iso
#     return None


# def add_country_genres(cursor, movieid, production_countries):
#     if not production_countries:
#         return
#     added = set()
#     for c in production_countries:
#         gname = map_country_to_genre_name(c)
#         if not gname or gname in added:
#             continue
#         gid = get_or_create_genre(cursor, gname)
#         link_movie_genre(cursor, movieid, gid)
#         added.add(gname)


# def get_or_create_cast(cursor, name, profile_path):
#     if not name:
#         return None
#     cursor.execute("SELECT castid FROM casts WHERE name=%s LIMIT 1", (name,))
#     row = cursor.fetchone()
#     if row:
#         return row[0]
#     cursor.execute("INSERT INTO casts (name, profile_path) VALUES (%s,%s)", (name, profile_path))
#     return cursor.lastrowid


# def link_movie_cast(cursor, movieid, castid):
#     if castid is None:
#         return
#     cursor.execute("INSERT IGNORE INTO moviecasts (movieid, castid) VALUES (%s,%s)", (movieid, castid))

# # ---- Shows helpers ----
# def shows_exist(cursor, movieid):
#     cursor.execute("SELECT showid FROM shows WHERE movieid=%s LIMIT 1", (movieid,))
#     return cursor.fetchone() is not None


# def parse_release_date_or_none(release_date_str):
#     if not release_date_str:
#         return None
#     try:
#         return datetime.strptime(release_date_str, "%Y-%m-%d").date()
#     except Exception:
#         return None


# def random_future_date(min_year=2026, max_year=2028):
#     start = date(min_year, 1, 1)
#     end = date(max_year, 12, 31)
#     days = (end - start).days
#     return start + timedelta(days=random.randint(0, days))


# def get_future_base_date(release_date_str):
#     rd = parse_release_date_or_none(release_date_str)
#     if rd and rd.year >= 2026:
#         return rd
#     return random_future_date(2026, 2028)


# def expand_time_slots(time_slots, desired_count):
#     slots = sorted(time_slots)
#     if len(slots) >= desired_count:
#         return slots[:desired_count]
#     minutes = [t.hour * 60 + t.minute for t in slots]
#     increment = 60
#     cur = minutes[-1]
#     while len(minutes) < desired_count:
#         cur = (cur + increment) % (24 * 60)
#         if cur not in minutes:
#             minutes.append(cur)
#         else:
#             increment += 15
#     minutes = minutes[:desired_count]
#     return [dtime(m // 60, m % 60) for m in minutes]


# def create_shows_for_movie(cursor, movieid, base_date=None, n_shows=None,
#                            days_span=SHOW_DAYS_SPAN, time_slots=SHOW_TIME_SLOTS,
#                            price_min=PRICE_MIN, price_max=PRICE_MAX):
#     if shows_exist(cursor, movieid):
#         return 0

#     if base_date is None:
#         base_date = date.today()

#     if n_shows is None:
#         n_shows = random.randint(SHOWS_PER_MOVIE_MIN, SHOWS_PER_MOVIE_MAX)

#     if n_shows < SHOWS_PER_DAY_MIN:
#         n_shows = SHOWS_PER_DAY_MIN

#     max_capacity = (max(0, days_span) + 1) * SHOWS_PER_DAY_MAX
#     if n_shows > max_capacity:
#         n_shows = max_capacity

#     days_min = math.ceil(n_shows / SHOWS_PER_DAY_MAX)
#     days_max = min((days_span + 1), max(1, n_shows // SHOWS_PER_DAY_MIN))
#     if days_max < days_min:
#         days_max = days_min
#     active_days = random.randint(days_min, days_max)

#     per_day_counts = [SHOWS_PER_DAY_MIN] * active_days
#     remaining = n_shows - SHOWS_PER_DAY_MIN * active_days

#     indices = list(range(active_days))
#     random.shuffle(indices)
#     for i in indices:
#         if remaining <= 0:
#             break
#         cap = SHOWS_PER_DAY_MAX - SHOWS_PER_DAY_MIN
#         add = min(remaining, cap)
#         if add > 0:
#             extra = random.randint(0, add)
#             per_day_counts[i] += extra
#             remaining -= extra

#     idx = 0
#     while remaining > 0:
#         cap = SHOWS_PER_DAY_MAX - per_day_counts[idx]
#         if cap > 0:
#             take = min(cap, remaining)
#             per_day_counts[idx] += take
#             remaining -= take
#         idx = (idx + 1) % active_days

#     possible_offsets = list(range(0, days_span + 1))
#     if active_days > len(possible_offsets):
#         active_offsets = possible_offsets[:]
#     else:
#         active_offsets = random.sample(possible_offsets, k=active_days)
#     active_offsets.sort()

#     slots_expanded = expand_time_slots(time_slots, max(SHOWS_PER_DAY_MAX, len(time_slots)))

#     inserted = 0
#     for day_offset, count in zip(active_offsets, per_day_counts):
#         chosen_date = base_date + timedelta(days=day_offset)
#         if count > len(slots_expanded):
#             slots_for_day = slots_expanded[:count]
#         else:
#             slots_for_day = random.sample(slots_expanded, count)
#         for t in slots_for_day:
#             show_dt = datetime.combine(chosen_date, t)
#             price = round(random.uniform(price_min, price_max), 2)
#             cursor.execute(
#                 "INSERT INTO shows (movieid, show_date_time, price) VALUES (%s, %s, %s)",
#                 (movieid, show_dt.strftime("%Y-%m-%d %H:%M:%S"), price)
#             )
#             inserted += 1
#     return inserted

# # -------------- Validation --------------
# def is_allowed_country(raw_production_countries):
#     codes = {c.get("iso_3166_1") for c in raw_production_countries if c.get("iso_3166_1")}
#     return not ALLOWED_COUNTRIES.isdisjoint(codes)


# def passes_quality_checks(detail):
#     if (detail["vote_average"] is None) or (detail["vote_average"] < MIN_VOTE_AVERAGE):
#         return False
#     if detail["vote_count"] < MIN_VOTE_COUNT:
#         return False
#     if detail["popularity"] < MIN_POPULARITY:
#         return False
#     return True

# # ---------------- Main ----------------
# def main():
#     if TMDB_API_KEY == "YOUR_TMDB_API_KEY":
#         print("ERROR: set TMDB_API_KEY in the script")
#         return

#     ids = collect_korean_movies(TARGET_PAGES)
#     print(f"[INFO] Total Korean movie ids collected: {len(ids)}")


#     cnx = connect_db(DB_CONFIG)
#     cursor = cnx.cursor()

#     inserted = 0
#     skipped = 0
#     errors = 0
#     try:
#         for idx, mid in enumerate(ids, start=1):
#             try:
#                 detail, raw_full = fetch_movie_detail_and_credits(mid)
#                 # country check
#                 if not is_allowed_country(detail["production_countries"]):
#                     skipped += 1
#                     continue
#                 # quality check
#                 if not passes_quality_checks(detail):
#                     skipped += 1
#                     continue
#                 # ensure release_date is at least 2026 or later
#                 base_date = get_future_base_date(detail.get("release_date"))
#                 # if original release_date was before 2026 or missing, overwrite so DB stores a future release date
#                 parsed_original = parse_release_date_or_none(detail.get("release_date"))
#                 if not parsed_original or parsed_original.year < 2026:
#                     detail["release_date"] = base_date.strftime("%Y-%m-%d")

#                 # avoid duplicates (use possibly-updated release_date)
#                 if movie_exists(cursor, detail["title"], detail["release_date"]):
#                     skipped += 1
#                     continue
#                 # insert movie
#                 movieid = insert_movie(cursor, detail)
#                 # genres: name-based
#                 for g in detail["genres"]:
#                     gname = g.get("name")
#                     gid = get_or_create_genre(cursor, gname)
#                     link_movie_genre(cursor, movieid, gid)

#                 # --- NEW: add country-as-genre (JP->Japan, KR->Korea, US->US, CN->China, VN->Vietnam, EU->Europe) ---
#                 add_country_genres(cursor, movieid, detail["production_countries"])
#                 # -----------------------------------------------------------------------------------------------------

#                 # casts: name-based, store profile_path if available
#                 for c in detail["casts"]:
#                     cname = c.get("name")
#                     profile_path = (TMDB_IMAGE_BASE + c.get("profile_path")) if c.get("profile_path") else None
#                     cid = get_or_create_cast(cursor, cname, profile_path)
#                     link_movie_cast(cursor, movieid, cid)

#                 # ----- TẠO NHIỀU SHOWS CHO PHIM NÀY (10-15 shows, trải nhiều ngày) -----
#                 shows_created = create_shows_for_movie(cursor, movieid, base_date=base_date)
#                 if shows_created:
#                     print(f"[INFO] Created {shows_created} shows for movieid={movieid} ({detail['title']})")
#                 # ----------------------------------

#                 inserted += 1
#                 if idx % BATCH_COMMIT == 0:
#                     cnx.commit()
#                     print(f"[COMMIT] {idx}/{len(ids)} processed, inserted so far: {inserted}")
#                 # polite delay
#                 time.sleep(SLEEP_BETWEEN_REQUESTS)
#             except Exception as e:
#                 print(f"[ERR] Movie {mid}: {e}")
#                 errors += 1
#                 # small pause on error
#                 time.sleep(1)
#         cnx.commit()
#         print(f"[DONE] Inserted: {inserted}, Skipped: {skipped}, Errors: {errors}")
#     finally:
#         cursor.close()
#         cnx.close()

# if __name__ == "__main__":
#     main()


import sys
sys.stdout.reconfigure(encoding='utf-8')
import sys
import time
import requests
import mysql.connector
from mysql.connector import errorcode
import random
from datetime import datetime, date, time as dtime, timedelta
import math

# ---------------- CONFIG ----------------
TMDB_API_KEY = "0ae7ede8c76c4663f8fb43e3813fc697"   # <-- set this
DB_CONFIG = {
    "host": "127.0.0.1",
    "user": "root",
    "password": "",                  # <-- set your password
    "database": "cinezonedb",
    "port": 3306,
    "raise_on_warnings": True,
}
TARGET_PAGES = 4       # pages per endpoint (20 items/page)
SLEEP_BETWEEN_REQUESTS = 0.25
BATCH_COMMIT = 20

# ----- Shows configuration -----
SHOWS_PER_MOVIE_MIN = 10   # min number of shows to create per movie
SHOWS_PER_MOVIE_MAX = 15   # max number of shows to create per movie
SHOW_DAYS_SPAN = 28        # spread shows across this many days starting from base_date
SHOW_TIME_SLOTS = [
    dtime(9, 30),
    dtime(11, 30),
    dtime(13, 30),
    dtime(15, 30),
    dtime(17, 30),
    dtime(19, 30),
    dtime(21, 30),
]                           # possible time slots
PRICE_MIN = 50.00
PRICE_MAX = 150.00

# per-day constraints
SHOWS_PER_DAY_MIN = 5
SHOWS_PER_DAY_MAX = 10
# --------------------------------

# Filtering
MIN_VOTE_AVERAGE = 0
MIN_VOTE_COUNT = 0
MIN_POPULARITY = 0
# ALLOWED_COUNTRIES = {"US", "JP", "KR", "CN", "VN"} zh ja ko vi en # allowed production_countries
ALLOWED_COUNTRIES = {"VN"} 
# TMDB
TMDB_BASE = "https://api.themoviedb.org/3"
TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/original"
SESSION = requests.Session()
SESSION.params = {"api_key": TMDB_API_KEY, "language": "en-US"}
# ----------------------------------------

# Ensure console prints unicode on Windows
try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    try:
        import io
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
    except Exception:
        pass


def tmdb_get(path, params=None, max_retries=3):
    if params is None:
        params = {}
    url = TMDB_BASE + path
    for attempt in range(1, max_retries + 1):
        try:
            resp = SESSION.get(url, params=params, timeout=15)
            if resp.status_code == 200:
                return resp.json()
            if resp.status_code == 429:
                retry_after = int(resp.headers.get("Retry-After", "3"))
                print(f"[TMDB] Rate limited. Sleeping {retry_after}s...")
                time.sleep(retry_after)
            else:
                print(f"[TMDB] HTTP {resp.status_code} for {url} (attempt {attempt})")
        except requests.RequestException as e:
            print(f"[TMDB] Request error: {e} (attempt {attempt})")
        time.sleep(0.5 * attempt)
    raise RuntimeError(f"Failed to fetch {url}")


def collect_korean_movies(pages=TARGET_PAGES):
    ids = []
    for page in range(1, pages + 1):
        params = {
            "with_original_language":"vi", 
            "region": "VN",
            "page": page
        }
        data = tmdb_get("/discover/movie", params=params)
        for r in data.get("results", []):
            ids.append(r.get("id"))
        time.sleep(SLEEP_BETWEEN_REQUESTS)
    print(f"[INFO] Collected {len(ids)} Korean movie ids")
    return ids


def collect_ids_from_provider(provider_id=8, region='VN', pages=TARGET_PAGES):
    ids = []
    for page in range(1, pages + 1):
        params = {"with_watch_providers": provider_id, "watch_region": region, "page": page}
        data = tmdb_get("/discover/movie", params=params)
        for r in data.get("results", []):
            ids.append(r.get("id"))
        time.sleep(SLEEP_BETWEEN_REQUESTS)
    print(f"[INFO] Collected {len(ids)} ids from provider_id={provider_id} region={region}")
    return ids


# ← NEW: Extract trailer URL from videos response
def extract_trailer_url(videos_response):
    """
    Extract best trailer URL from TMDB videos response.
    Priority: Official Trailer > Trailer > Teaser > First video
    """
    if not videos_response or "results" not in videos_response:
        return None
    
    results = videos_response.get("results", [])
    
    # Filter YouTube videos only
    youtube_videos = [v for v in results if v.get("site") == "YouTube"]
    
    if not youtube_videos:
        return None
    
    # Priority 1: Official Trailer
    official_trailer = next(
        (v for v in youtube_videos 
         if v.get("type") == "Trailer" and v.get("official") == True),
        None
    )
    
    # Priority 2: Any Trailer
    if not official_trailer:
        official_trailer = next(
            (v for v in youtube_videos if v.get("type") == "Trailer"),
            None
        )
    
    # Priority 3: Teaser
    if not official_trailer:
        official_trailer = next(
            (v for v in youtube_videos if v.get("type") == "Teaser"),
            None
        )
    
    # Priority 4: First video
    if not official_trailer and youtube_videos:
        official_trailer = youtube_videos[0]
    
    if official_trailer and official_trailer.get("key"):
        key = official_trailer.get("key")
        # Return embed URL (better for iframe)
        return f"https://www.youtube.com/embed/{key}"
    
    return None


def fetch_movie_detail_and_credits(mid):
    d = tmdb_get(f"/movie/{mid}")
    credits = tmdb_get(f"/movie/{mid}/credits")
    
    # ← NEW: Fetch videos (trailers)
    videos = tmdb_get(f"/movie/{mid}/videos")
    
    va = d.get("vote_average")
    vote_average = round(float(va), 1) if va is not None else None
    poster = (TMDB_IMAGE_BASE + d["poster_path"]) if d.get("poster_path") else None
    backdrop = (TMDB_IMAGE_BASE + d["backdrop_path"]) if d.get("backdrop_path") else None
    
    # ← NEW: Extract trailer URL
    trailer_url = extract_trailer_url(videos)
    
    return {
        "title": d.get("title") or d.get("original_title"),
        "overview": d.get("overview"),
        "release_date": d.get("release_date") or None,
        "runtime": d.get("runtime"),
        "poster_path": poster,
        "backdrop_path": backdrop,
        "vote_average": vote_average,
        "vote_count": int(d.get("vote_count") or 0),
        "popularity": float(d.get("popularity") or 0.0),
        "production_countries": d.get("production_countries", []),
        "genres": d.get("genres", []),
        "casts": credits.get("cast", [])[:10] if credits else [],
        "trailer": trailer_url  # ← NEW FIELD
    }, d

# ---------------- DB helpers ----------------
def connect_db(cfg):
    return mysql.connector.connect(**cfg)


def movie_exists(cursor, title, release_date):
    if not title:
        return False
    if release_date:
        cursor.execute("SELECT movieid FROM movies WHERE title=%s AND release_date=%s LIMIT 1", (title, release_date))
    else:
        cursor.execute("SELECT movieid FROM movies WHERE title=%s AND release_date IS NULL LIMIT 1", (title,))
    return cursor.fetchone() is not None


def insert_movie(cursor, m):
    # ← MODIFIED: Added trailer field
    sql = ("INSERT INTO movies "
           "(title, overview, release_date, runtime, poster_path, backdrop_path, vote_average, vote_count, trailer) "
           "VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)")
    cursor.execute(sql, (
        m["title"], m["overview"], m["release_date"], m["runtime"],
        m["poster_path"], m["backdrop_path"], m["vote_average"], m["vote_count"],
        m.get("trailer")  # ← NEW: Insert trailer URL
    ))
    return cursor.lastrowid


def get_or_create_genre(cursor, name):
    if not name:
        return None
    cursor.execute("SELECT genreid FROM genres WHERE name=%s LIMIT 1", (name,))
    row = cursor.fetchone()
    if row:
        return row[0]
    cursor.execute("INSERT INTO genres (name) VALUES (%s)", (name,))
    return cursor.lastrowid


def link_movie_genre(cursor, movieid, genreid):
    if genreid is None:
        return
    cursor.execute("INSERT IGNORE INTO moviegenres (movieid, genreid) VALUES (%s,%s)", (movieid, genreid))

# ----- Country -> genre helpers -----
EUROPEAN_ISOS = {
    'AL','AD','AT','BY','BE','BA','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IS','IE','IT','LV','LI','LT','LU','MK','MT','MD','MC','ME','NL','NO','PL','PT','RO','RU','SM','RS','SK','SI','ES','SE','CH','UA','GB'
}


def map_country_to_genre_name(country):
    if not country:
        return None
    iso = (country.get('iso_3166_1') or '').upper()
    name = (country.get('name') or '').lower()

    if iso == 'KR' or 'korea' in name:
        return 'Korea'
    if iso == 'JP' or 'japan' in name:
        return 'Japan'
    if iso == 'US' or 'united states' in name or 'america' in name or 'usa' in name:
        return 'US'
    if iso == 'CN' or 'china' in name:
        return 'China'
    if iso == 'VN' or 'vietnam' in name:
        return 'Vietnam'

    if iso in EUROPEAN_ISOS or any(eu in name for eu in ('europe','united kingdom','britain','england')):
        return 'Europe'

    if country.get('name'):
        nm = country.get('name')
        nm = nm.replace('Republic of ', '').replace('People\'s Republic of ', '').strip()
        return nm
    if iso:
        return iso
    return None


def add_country_genres(cursor, movieid, production_countries):
    if not production_countries:
        return
    added = set()
    for c in production_countries:
        gname = map_country_to_genre_name(c)
        if not gname or gname in added:
            continue
        gid = get_or_create_genre(cursor, gname)
        link_movie_genre(cursor, movieid, gid)
        added.add(gname)


def get_or_create_cast(cursor, name, profile_path):
    if not name:
        return None
    cursor.execute("SELECT castid FROM casts WHERE name=%s LIMIT 1", (name,))
    row = cursor.fetchone()
    if row:
        return row[0]
    cursor.execute("INSERT INTO casts (name, profile_path) VALUES (%s,%s)", (name, profile_path))
    return cursor.lastrowid


def link_movie_cast(cursor, movieid, castid):
    if castid is None:
        return
    cursor.execute("INSERT IGNORE INTO moviecasts (movieid, castid) VALUES (%s,%s)", (movieid, castid))

# ---- Shows helpers ----
def shows_exist(cursor, movieid):
    cursor.execute("SELECT showid FROM shows WHERE movieid=%s LIMIT 1", (movieid,))
    return cursor.fetchone() is not None


def parse_release_date_or_none(release_date_str):
    if not release_date_str:
        return None
    try:
        return datetime.strptime(release_date_str, "%Y-%m-%d").date()
    except Exception:
        return None


def random_future_date(min_year=2026, max_year=2028):
    start = date(min_year, 1, 1)
    end = date(max_year, 12, 31)
    days = (end - start).days
    return start + timedelta(days=random.randint(0, days))


def get_future_base_date(release_date_str):
    rd = parse_release_date_or_none(release_date_str)
    if rd and rd.year >= 2026:
        return rd
    return random_future_date(2026, 2028)


def expand_time_slots(time_slots, desired_count):
    slots = sorted(time_slots)
    if len(slots) >= desired_count:
        return slots[:desired_count]
    minutes = [t.hour * 60 + t.minute for t in slots]
    increment = 60
    cur = minutes[-1]
    while len(minutes) < desired_count:
        cur = (cur + increment) % (24 * 60)
        if cur not in minutes:
            minutes.append(cur)
        else:
            increment += 15
    minutes = minutes[:desired_count]
    return [dtime(m // 60, m % 60) for m in minutes]


def create_shows_for_movie(cursor, movieid, base_date=None, n_shows=None,
                           days_span=SHOW_DAYS_SPAN, time_slots=SHOW_TIME_SLOTS,
                           price_min=PRICE_MIN, price_max=PRICE_MAX):
    if shows_exist(cursor, movieid):
        return 0

    if base_date is None:
        base_date = date.today()

    if n_shows is None:
        n_shows = random.randint(SHOWS_PER_MOVIE_MIN, SHOWS_PER_MOVIE_MAX)

    if n_shows < SHOWS_PER_DAY_MIN:
        n_shows = SHOWS_PER_DAY_MIN

    max_capacity = (max(0, days_span) + 1) * SHOWS_PER_DAY_MAX
    if n_shows > max_capacity:
        n_shows = max_capacity

    days_min = math.ceil(n_shows / SHOWS_PER_DAY_MAX)
    days_max = min((days_span + 1), max(1, n_shows // SHOWS_PER_DAY_MIN))
    if days_max < days_min:
        days_max = days_min
    active_days = random.randint(days_min, days_max)

    per_day_counts = [SHOWS_PER_DAY_MIN] * active_days
    remaining = n_shows - SHOWS_PER_DAY_MIN * active_days

    indices = list(range(active_days))
    random.shuffle(indices)
    for i in indices:
        if remaining <= 0:
            break
        cap = SHOWS_PER_DAY_MAX - SHOWS_PER_DAY_MIN
        add = min(remaining, cap)
        if add > 0:
            extra = random.randint(0, add)
            per_day_counts[i] += extra
            remaining -= extra

    idx = 0
    while remaining > 0:
        cap = SHOWS_PER_DAY_MAX - per_day_counts[idx]
        if cap > 0:
            take = min(cap, remaining)
            per_day_counts[idx] += take
            remaining -= take
        idx = (idx + 1) % active_days

    possible_offsets = list(range(0, days_span + 1))
    if active_days > len(possible_offsets):
        active_offsets = possible_offsets[:]
    else:
        active_offsets = random.sample(possible_offsets, k=active_days)
    active_offsets.sort()

    slots_expanded = expand_time_slots(time_slots, max(SHOWS_PER_DAY_MAX, len(time_slots)))

    inserted = 0
    for day_offset, count in zip(active_offsets, per_day_counts):
        chosen_date = base_date + timedelta(days=day_offset)
        if count > len(slots_expanded):
            slots_for_day = slots_expanded[:count]
        else:
            slots_for_day = random.sample(slots_expanded, count)
        for t in slots_for_day:
            show_dt = datetime.combine(chosen_date, t)
            price = round(random.uniform(price_min, price_max), 2)
            cursor.execute(
                "INSERT INTO shows (movieid, show_date_time, price) VALUES (%s, %s, %s)",
                (movieid, show_dt.strftime("%Y-%m-%d %H:%M:%S"), price)
            )
            inserted += 1
    return inserted

# -------------- Validation --------------
def is_allowed_country(raw_production_countries):
    codes = {c.get("iso_3166_1") for c in raw_production_countries if c.get("iso_3166_1")}
    return not ALLOWED_COUNTRIES.isdisjoint(codes)


def passes_quality_checks(detail):
    if (detail["vote_average"] is None) or (detail["vote_average"] < MIN_VOTE_AVERAGE):
        return False
    if detail["vote_count"] < MIN_VOTE_COUNT:
        return False
    if detail["popularity"] < MIN_POPULARITY:
        return False
    return True

# ---------------- Main ----------------
def main():
    if TMDB_API_KEY == "YOUR_TMDB_API_KEY":
        print("ERROR: set TMDB_API_KEY in the script")
        return

    ids = collect_korean_movies(TARGET_PAGES)
    print(f"[INFO] Total Korean movie ids collected: {len(ids)}")


    cnx = connect_db(DB_CONFIG)
    cursor = cnx.cursor()

    inserted = 0
    skipped = 0
    errors = 0
    try:
        for idx, mid in enumerate(ids, start=1):
            try:
                detail, raw_full = fetch_movie_detail_and_credits(mid)
                # country check
                if not is_allowed_country(detail["production_countries"]):
                    skipped += 1
                    continue
                # quality check
                if not passes_quality_checks(detail):
                    skipped += 1
                    continue
                # ensure release_date is at least 2026 or later
                base_date = get_future_base_date(detail.get("release_date"))
                # if original release_date was before 2026 or missing, overwrite so DB stores a future release date
                parsed_original = parse_release_date_or_none(detail.get("release_date"))
                if not parsed_original or parsed_original.year < 2026:
                    detail["release_date"] = base_date.strftime("%Y-%m-%d")

                # avoid duplicates (use possibly-updated release_date)
                if movie_exists(cursor, detail["title"], detail["release_date"]):
                    skipped += 1
                    continue
                
                # insert movie
                movieid = insert_movie(cursor, detail)
                
                # ← NEW: Print trailer info for debugging
                if detail.get("trailer"):
                    print(f"[TRAILER] movieid={movieid}: {detail['trailer']}")
                else:
                    print(f"[NO TRAILER] movieid={movieid}")
                
                # genres: name-based
                for g in detail["genres"]:
                    gname = g.get("name")
                    gid = get_or_create_genre(cursor, gname)
                    link_movie_genre(cursor, movieid, gid)

                # --- NEW: add country-as-genre (JP->Japan, KR->Korea, US->US, CN->China, VN->Vietnam, EU->Europe) ---
                add_country_genres(cursor, movieid, detail["production_countries"])
                # -----------------------------------------------------------------------------------------------------

                # casts: name-based, store profile_path if available
                for c in detail["casts"]:
                    cname = c.get("name")
                    profile_path = (TMDB_IMAGE_BASE + c.get("profile_path")) if c.get("profile_path") else None
                    cid = get_or_create_cast(cursor, cname, profile_path)
                    link_movie_cast(cursor, movieid, cid)

                # ----- TẠO NHIỀU SHOWS CHO PHIM NÀY (10-15 shows, trải nhiều ngày) -----
                shows_created = create_shows_for_movie(cursor, movieid, base_date=base_date)
                if shows_created:
                    print(f"[INFO] Created {shows_created} shows for movieid={movieid} ({detail['title']})")
                # ----------------------------------

                inserted += 1
                if idx % BATCH_COMMIT == 0:
                    cnx.commit()
                    print(f"[COMMIT] {idx}/{len(ids)} processed, inserted so far: {inserted}")
                # polite delay
                time.sleep(SLEEP_BETWEEN_REQUESTS)
            except Exception as e:
                print(f"[ERR] Movie {mid}: {e}")
                errors += 1
                # small pause on error
                time.sleep(1)
        cnx.commit()
        print(f"[DONE] Inserted: {inserted}, Skipped: {skipped}, Errors: {errors}")
    finally:
        cursor.close()
        cnx.close()

if __name__ == "__main__":
    main()