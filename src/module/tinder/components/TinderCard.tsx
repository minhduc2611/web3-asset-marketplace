import { MockUser } from "../resource/modal/user";

interface TinderCardProps {
  user: MockUser;
  index: number;
  style?: React.CSSProperties;
  renderBadge: () => JSX.Element;
}

const TinderCard = ({
  style,
  user,
  index,
  renderBadge = () => <></>,
}: TinderCardProps) => {
  return (
    <div
      className="h-full top-0 left-0 right-0 rounded-lg"
      style={{
        zIndex: index,
        ...style,
        boxShadow:
          "rgb(0, 0, 0) 0px 52px 53px -18px inset, rgb(0, 0, 0) 0px -100px 129px -10px inset",
      }}
    >
      {renderBadge()}
      <div className="relative h-full transition-all duration-300 cursor-pointer">
        <div className="absolute px-4 text-white bottom-6">
          <h1 className="text-[1.55rem] font-bold">
            {user?.firstName} {user?.lastName}, {`${user.age}`}
          </h1>
          <p>
            Lives in {user.address.city}
          </p>
          <p>
            {user.address.coordinates.lat.toFixed(0)} miles away
          </p>
        </div>
      </div>
    </div>
  );
};
export default TinderCard;
