import React from "react";
import { InnerLayout } from "../layout/InnerLayout";
import { FaUser, FaUserTie } from "react-icons/fa";
import { useAuth } from "wasp/client/auth";
import { Link } from "react-router-dom";
import { AvatarFunc, useUserEmailPart } from "../utils/Functions";

export default function CustomerProfile() {
  const { data: user } = useAuth();
  const emailPart = useUserEmailPart(user);
//   console.log(emailPart);

  return (
    <InnerLayout childHeader="Profile" ChildIcon={FaUser}>
      <div className="w-full max-w-[75rem] mx-auto h-auto md:p-6 p-4 flex flex-col justify-start items-center gap-4 rounded-md card-bg">
        <div className="w-[6.25rem] h-[6.25rem] rounded-full flex items-center justify-center border ">
          {user ? (
            <img
              src={user.name ? AvatarFunc(user.name) : AvatarFunc(emailPart)}
              alt={user.name}
              className="w-10 h-10 rounded-full"
            />
          ) : (
            <FaUserTie className="w-6 h-6 placeholder_user" />
          )}
        </div>
        <h3 className="">{user?.name ? user.name : emailPart}</h3>
        <h3 className="">{user?.email}</h3>
        <Link to={`/password-reset`}>
          Reset password?
        </Link>
      </div>
    </InnerLayout>
  );
}
