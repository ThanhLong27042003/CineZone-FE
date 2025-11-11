import { lazy, Suspense, useEffect } from "react";
import PosterSection from "../components/PosterSection";
import StatsSection from "../components/StatsSection";
import { useInView } from "react-intersection-observer";
import { useDispatch, useSelector } from "react-redux";
import { getTopMovieForHomePageApi } from "../redux/reducer/FilmReducer";
import Loading from "../components/Loading";

const FeaturedSectionLazy = lazy(() => import("../components/FeaturedSection"));

const FeaturedSection = ({ title, arrFilm }) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });
  return (
    <div ref={ref} className="min-h-[300px]">
      {inView ? (
        <Suspense fallback={<Loading />}>
          <FeaturedSectionLazy title={title} arrFilm={arrFilm} />
        </Suspense>
      ) : (
        <Loading />
      )}
    </div>
  );
};

const Home = () => {
  const dispatch = useDispatch();
  const genres = ["US", "Animation", "Korea", "China", "voteCount"];
  const titles = [
    "US-UK",
    `Kho tàng\nAnime`,
    `Hàn Quốc mới\nnhất`,
    `Trung Quốc mới\nnhất`,
    `Nhiều lượt vote\nnhất`,
  ];
  const topMovieList = useSelector(
    (state) => state.FilmReducer.filmsByGenre || []
  );

  useEffect(() => {
    dispatch(getTopMovieForHomePageApi(genres));
  }, [dispatch]);
  return (
    <div>
      <PosterSection />
      {topMovieList.map((arrFilm, idx) => (
        <FeaturedSection key={idx} title={titles[idx]} arrFilm={arrFilm} />
      ))}
      <StatsSection />
    </div>
  );
};

export default Home;
