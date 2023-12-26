const CommonProgressBar = ({percentage}: {percentage:number}) => {
  return (
    <div
      className="bg-green-600 h-2.5 rounded-full dark:bg-green-500"
      style={{ width: `${Number.isNaN(percentage) ? 0 : percentage}%` }}
    ></div>
  );
};

export default CommonProgressBar;
