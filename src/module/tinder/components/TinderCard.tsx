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
          "inset 0px 44px 226px -19px #000000, inset 0px -59px 116px -10px #000000",
          // box-shadow: inset 0 0 109px 0px rgba(0, 0, 0, 1);
      }}
    >
      {renderBadge()}
      <figure className="relative h-full transition-all duration-300 cursor-pointer">
        <figcaption className="absolute px-4 text-lg text-white bottom-6">
          <p>
            {user?.firstName} {user?.lastName} {`(${user.id})`}
          </p>
        </figcaption>
      </figure>
      {/* <img alt="src" className="object-fill h-full m-auto" src={user.image} /> */}
    </div>
  );
};


/**
 * box-shadow: rgb(0, 0, 0, 1) 0px 32px 26px 2px inset, rgb(0, 0, 0, 1) 0px -47px 5px 7px inset;
 */
export default TinderCard;
