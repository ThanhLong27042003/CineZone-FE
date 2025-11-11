import cloudinary
import cloudinary.uploader

# 1️⃣ Cấu hình Cloudinary
cloudinary.config(
  cloud_name="dgosjnium",     # thay bằng tên thật
  api_key="365861488456227",
  api_secret="VIovr6dcWHptruMdLdMzVVVCIuc"
)

# 2️⃣ Danh sách URL TMDB (cắt bớt ví dụ)
urls = [
"https://image.tmdb.org/t/p/original/xykXEXEVZ3V7mVBCSmiin693G4y.jpg",
"https://image.tmdb.org/t/p/original/kze5DdNtfsqGhmK8Z38Qz57iaet.jpg",
"https://image.tmdb.org/t/p/original/zyZE8dLaJg6o4jDmoNdPctlmaHb.jpg",
"https://image.tmdb.org/t/p/original/zZ6nRdNQNxRnZ1LQ2ttPBZl9AXV.jpg",
"https://image.tmdb.org/t/p/original/u7vBLDg1OErWVEE4ij4EhqdYzvE.jpg",
"https://image.tmdb.org/t/p/original/qerBcGLdXGErq6EjKPVM4LWl3A8.jpg",
"https://image.tmdb.org/t/p/original/3RgB5fylSugudOEuZmH6Hw9yizz.jpg",
"https://image.tmdb.org/t/p/original/hbvg9M2S3ufj6uWsCPQdmqinPPf.jpg",
"https://image.tmdb.org/t/p/original/rbCo39CXe62GjTVAIDrkR5pPs5L.jpg",
"https://image.tmdb.org/t/p/original/6a3aiSYNqABoV1Fq8n10LMOBxhH.jpg",
"https://image.tmdb.org/t/p/original/mmkkof9JxBKQrfMQ5P3N5SghmSs.jpg",
"https://image.tmdb.org/t/p/original/zTF79SlKhi4Ve4gLf9m3uJVbIn1.jpg",
"https://image.tmdb.org/t/p/original/gYGKjYM9U9eG0nJr2oZK3UQo1ov.jpg",
"https://image.tmdb.org/t/p/original/4DwNh1VzR0HlQJlPajRJXy3wC1G.jpg",
"https://image.tmdb.org/t/p/original/ow9Z7mr9KL2TVMYfIIYKODCIDgP.jpg",
"https://image.tmdb.org/t/p/original/vVM1gADbjyNnGzj6EsJo79GBhtg.jpg",
"https://image.tmdb.org/t/p/original/1K7pHhCZprfDXB7LkCquIK62yCb.jpg",
"https://image.tmdb.org/t/p/original/iYVqhRnkZWwwkyK8XFVFqMQFC9F.jpg",
"https://image.tmdb.org/t/p/original/ngclwkLdHmSTq9OXlNrDBoyDBlc.jpg",
"https://image.tmdb.org/t/p/original/b5SnA6t9syc00FgtdP9ybrDfWC2.jpg",
"https://image.tmdb.org/t/p/original/q55E2yzQbiTzTPtulphlBskzX5k.jpg",
"https://image.tmdb.org/t/p/original/mkv2cz71iLvpYjUWCfBPh6nZaaD.jpg",
"https://image.tmdb.org/t/p/original/ZtcGMc204JsNqfjS9lU6udRgpo.jpg",
"https://image.tmdb.org/t/p/original/eU7IfdWq8KQy0oNd4kKXS0QUR08.jpg",
"https://image.tmdb.org/t/p/original/538U9snNc2fpnOmYXAPUh3zn31H.jpg",
"https://image.tmdb.org/t/p/original/zNriRTr0kWwyaXPzdg1EIxf0BWk.jpg",
"https://image.tmdb.org/t/p/original/w3Bi0wygeFQctn6AqFTwhGNXRwL.jpg",
"https://image.tmdb.org/t/p/original/AeDzjt00Hfh9CuW7TIUdYBJmWYM.jpg",
"https://image.tmdb.org/t/p/original/Q2OajDi2kcO6yErb1IAyVDTKMs.jpg",
"https://image.tmdb.org/t/p/original/s94NjfKkcSczZ1FembwmQZwsuwY.jpg",
"https://image.tmdb.org/t/p/original/7Zx3wDG5bBtcfk8lcnCWDOLM4Y4.jpg",
"https://image.tmdb.org/t/p/original/sItIskd5xpiE64bBWYwZintkGf3.jpg",
"https://image.tmdb.org/t/p/original/a6bItEVaxgphpMswho1wVRerv4r.jpg",
"https://image.tmdb.org/t/p/original/fMlAg1CyHTsCktwQrp74rl9RMwJ.jpg",
"https://image.tmdb.org/t/p/original/rthMuZfFv4fqEU4JVbgSW9wQ8rs.jpg",
"https://image.tmdb.org/t/p/original/uIpJPDNFoeX0TVml9smPrs9KUVx.jpg",
"https://image.tmdb.org/t/p/original/6Z0FhoZM56YkuXhvklMTpc7rc5u.jpg",
"https://image.tmdb.org/t/p/original/2IIKts2A9vnUdM9tTC76B8tDmuZ.jpg",
"https://image.tmdb.org/t/p/original/7Q2CmqIVJuDAESPPp76rWIiA0AD.jpg",
"https://image.tmdb.org/t/p/original/cT9ZfwoPDk8JbgkessmQgxAWiaM.jpg",
"https://image.tmdb.org/t/p/original/zav0v7gLWMu6pVwgsIAwt11GJ4C.jpg",
"https://image.tmdb.org/t/p/original/rOwEWgbryAxp7D1xpzREqh3EOTX.jpg",
"https://image.tmdb.org/t/p/original/uWeffFhprUohUL5GO3YfQqdsVrI.jpg",
"https://image.tmdb.org/t/p/original/kJ5Pm5PpyJZrRza1VEyUiwj3LkV.jpg",
"https://image.tmdb.org/t/p/original/hiKmpZMGZsrkA3cdce8a7Dpos1j.jpg",
"https://image.tmdb.org/t/p/original/jnFmHDHmPZrQ7vyHmxXHcoxp25j.jpg",
"https://image.tmdb.org/t/p/original/33dV6HAnXBmwKl640gO3U4auqUN.jpg",
"https://image.tmdb.org/t/p/original/sdwjQEM869JFwMytTmvr6ggvaUl.jpg",
"https://image.tmdb.org/t/p/original/fVpFOcQyHJM2di9upgSIwWD5wac.jpg",
"https://image.tmdb.org/t/p/original/jJJQ1PPXUEchqyZ9YyWzgSNU39Z.jpg",
"https://image.tmdb.org/t/p/original/37y53Jt8K6MvN6s4zJVFa61luO2.jpg",
"https://image.tmdb.org/t/p/original/7ZP8HtgOIDaBs12krXgUIygqEsy.jpg",
"https://image.tmdb.org/t/p/original/zecxlBpLx0aLIjNjX1IOZuaSgo0.jpg",
"https://image.tmdb.org/t/p/original/f8ng3EDMLkuTMupe4TjgiJS1r0S.jpg",
"https://image.tmdb.org/t/p/original/6UnVwCA6F29erZK29PKqRyHqFA.jpg",
"https://image.tmdb.org/t/p/original/fXmaCa7bE5mp9AMkVT8cKaI5GMK.jpg",
"https://image.tmdb.org/t/p/original/2NArMoObkAbnIPvqlHC3gRGsfBb.jpg",
"https://image.tmdb.org/t/p/original/xkXsV1WOiKfAJ6dzXiavdwsZ3E2.jpg",
"https://image.tmdb.org/t/p/original/x1j5VVU4ypEx1hM0PDYGwCJvwtS.jpg",
"https://image.tmdb.org/t/p/original/5DKVH8KeqFwPacWFMyYqTaECxJP.jpg",
"https://image.tmdb.org/t/p/original/nN4Gs3vZAOJ1D6FRtrwbU9VGYwU.jpg",
"https://image.tmdb.org/t/p/original/xk8CF3DAmiqLFI2YZAmxEJFqI1q.jpg",
"https://image.tmdb.org/t/p/original/6EO11KoiMMG29ISaQrm2G5DCe1X.jpg",
"https://image.tmdb.org/t/p/original/gEjNlhZhyHeto6Fy5wWy5Uk3A9D.jpg",
"https://image.tmdb.org/t/p/original/ukfI9QkU1aIhOhKXYWE9n3z1mFR.jpg",
"https://image.tmdb.org/t/p/original/xPpXYnCWfjkt3zzE0dpCNME1pXF.jpg",
"https://image.tmdb.org/t/p/original/8x9iKH8kWA0zdkgNdpAew7OstYe.jpg",
"https://image.tmdb.org/t/p/original/nv5wwZou159v5OC61i4ElR7OqyY.jpg",
"https://image.tmdb.org/t/p/original/gl0jzn4BupSbL2qMVeqrjKkF9Js.jpg",
"https://image.tmdb.org/t/p/original/a0GM57AnJtNi7lMOCamniiyV10W.jpg",
"https://image.tmdb.org/t/p/original/jxaNTMI41y0Gnu05WkGVc2a1nkO.jpg",
"https://image.tmdb.org/t/p/original/4tdV5AeojEdbvn6VpeQrbuDlmzs.jpg",
"https://image.tmdb.org/t/p/original/95ozIP0A2fKaAXxwDxUEVn74Iux.jpg",
"https://image.tmdb.org/t/p/original/5lAMQMWpXMsirvtLLvW7cJgEPkU.jpg",
"https://image.tmdb.org/t/p/original/hjWxngV6tidwDkfJDEgMjHD2KEz.jpg",
"https://image.tmdb.org/t/p/original/tb0uo01w2kDHiQwTszsLlSusAm4.jpg",
"https://image.tmdb.org/t/p/original/rcEDPOOOUTLFxLLQJggfLffbofe.jpg",
"https://image.tmdb.org/t/p/original/fK40VGYIm7hmKrLJ26fgPQU0qRG.jpg",
"https://image.tmdb.org/t/p/original/z6OZ2Q4FYELeGoBj9tVDWCvevkj.jpg",
"https://image.tmdb.org/t/p/original/h5pAEVma835u8xoE60kmLVopLct.jpg",
"https://image.tmdb.org/t/p/original/1YRtgjLb5xxUb2rsNRnr54Oc0B2.jpg",
"https://image.tmdb.org/t/p/original/gTRXgigmgKpeJjW07iq686HZyBD.jpg",
"https://image.tmdb.org/t/p/original/shqLeIkqPAAXM8iT6wVDiXUYz1p.jpg",
"https://image.tmdb.org/t/p/original/ulVUa2MvnJAjAeRt7h23FFJVRKH.jpg",
"https://image.tmdb.org/t/p/original/l8ubUlfzlB5R2j9cJ3CN7tj0gmd.jpg",
"https://image.tmdb.org/t/p/original/dZJcOyRonN0Kb7kJR3DE3esGn16.jpg",
"https://image.tmdb.org/t/p/original/qvZ91FwMq6O47VViAr8vZNQz3WI.jpg",
"https://image.tmdb.org/t/p/original/wYbOd1YdpDonQUHwRCTCY2grSq4.jpg",
"https://image.tmdb.org/t/p/original/cwsBDxvFn0pkxPOrQg8Koz2kMRM.jpg",
"https://image.tmdb.org/t/p/original/nSm9cij9VRrGDoZoS16CPnX0FqK.jpg",
"https://image.tmdb.org/t/p/original/4PKfa0zltSrp1BJoLl8zfvYXaac.jpg",
"https://image.tmdb.org/t/p/original/jDz6RYN3nKYtlo7J9IMvGoJit7B.jpg",
"https://image.tmdb.org/t/p/original/lU1fQews2gye23PocVE48CsTmOQ.jpg",
"https://image.tmdb.org/t/p/original/94cS0mzODEoNIXFT7nhPcI8V4IJ.jpg"


]

# 3️⃣ Upload tuần tự (có thể thêm folder)
for url in urls:
    response = cloudinary.uploader.upload(
        url,
        folder="cinezone_backdrop_images",  # tùy bạn đặt
            eager=[
        {"width": 291, "height": 196, "format": "webp"},
        {"width": 1526, "height": 869, "format": "webp"}
    ],
    eager_async=False,
        use_filename=True,
        unique_filename=False
    )
    print("Original:", response["secure_url"])
    print("Eager 342:", response["eager"][0]["secure_url"])
    print("Eager 1500:", response["eager"][1]["secure_url"])
    print("-" * 50)
