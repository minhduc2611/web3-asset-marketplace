import { MockUser } from "../resource/modal/user";

interface TinderCardProps {
  user: MockUser;
  index: number;
  renderBadge: () => JSX.Element;
}


const TinderCard = ({ user, index, renderBadge = () => <></>}: TinderCardProps) => {
  return (
    <div
      className="h-full top-0 left-0 right-0 rounded-lg"
      style={{ zIndex: index }}
    >
      {renderBadge()}
      <figure className="relative h-full transition-all duration-300 cursor-pointer">
        <figcaption className="absolute px-4 text-lg text-white bottom-6">
          <p>
            {user?.firstName} {user?.lastName}
          </p>
        </figcaption>
      </figure>
      {/* <img alt="src" className="object-fill h-full m-auto" src={user.image} /> */}
    </div>
  );
};

export default TinderCard;
