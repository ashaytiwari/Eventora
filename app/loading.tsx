import { ClockLoader } from "react-spinners";

const Loader = () => {

  const clockLoaderAttributes = {
    size: 100,
    color: '#5dfeca',
  };

  return (
    <section className="flex flex-col justify-center items-center gap-3 py-7 h-[calc(100vh-200px)]">
      <ClockLoader {...clockLoaderAttributes} />
      <h1 className="mt-10">Loading, please wait</h1>
    </section>
  );
};

export default Loader;