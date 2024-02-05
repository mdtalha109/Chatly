import { Avatar } from "@chakra-ui/avatar";

const UserListItem = ({ user, handleFunction }) => {

  return (
    <div className="flex px-3 py-2 cursor-pointer bg-[#E8E8E8] text-black items-center"
      onClick={handleFunction}
    >
      <Avatar
        mr={2}
        size="sm"
        cursor="pointer"
        name={user.name}
        src={user.pic}
      />
      <div>
        <div>{user.name}</div>
        <span fontSize="xs">
          <b>Email : </b>
          {user.email}
        </span>
      </div>
    </div>
  );
};

export default UserListItem;