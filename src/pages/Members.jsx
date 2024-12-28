import { InnerLayout } from "../layout/InnerLayout";
import { SettingsNav } from "../components/Settings/SettingsNav";
import { Modal } from "../components/Modal/Modal";
import { ConfirmDeleteModal } from "../components/Modal/ConfirmDeleteModal";
import { ListItem } from "../components/Settings/ListItem";
import { FormInput } from "../components/Form/FormInput";
import { useState, useEffect } from "react";
import {
  getUser,
  getUsers,
  getUsersByOrganization,
  updateUser,
  deleteUser,
  useQuery,
  sendInvite,
} from "wasp/client/operations";
import { LuPencilLine } from "react-icons/lu";
import { RiDeleteBin6Line } from "react-icons/ri";
import { GrGroup } from "react-icons/gr";
import { v4 as uuidv4 } from "uuid";

export const Members = ({ user }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("ORG_MEMBER");
  const [orgName, setOrgName] = useState("");

  const {
    data: currentUser,
    isUserLoading,
    isUserError,
  } = useQuery(getUser, { id: user.id });
  const {
    data: users,
    isLoading,
    isError,
    refetch,
  } = useQuery(
    user.role === "SUPER_ADMIN" ? getUsers : getUsersByOrganization,
    user.role === "ORG_ADMIN" || user.role === "ORG_MEMBER"
      ? { organizationId: user.organizationId }
      : undefined
  );

  useEffect(() => {
    if (!modalOpen) {
      resetModal();
    }
  }, [modalOpen]);

  useEffect(() => {
    setIsAdmin(user.role === "SUPER_ADMIN" || user.role === "ORG_ADMIN");
  }, [user.role]);

  const handleInvite = async (e) => {
    e.preventDefault();

    try {
      if (isEditMode) {
        // Update user role if in edit mode
        if (!selectedUser || !selectedUser.id) {
          throw new Error("No user selected for editing.");
        }
        await updateUser({ id: selectedUser.id, role });
      } else {
        // Check if the current user is authorized
        if (
          !user ||
          (user.role !== "ORG_ADMIN" && user.role !== "SUPER_ADMIN")
        ) {
          throw new Error(
            "Unauthorized: You do not have permission to invite users."
          );
        }

        // Generate a unique token for the invite
        const token = uuidv4();

        // Set expiration time to 1 minute from now
        const expirationTime = new Date().getTime() + 1 * 60 * 1000; // 1 minute
        
        // Send the invite
        await sendInvite({
          email,
          role,
          token,
          expirationTime,
          organizationId: user.organizationId || null,
          sendingUserId: user.id,
          organizationName: currentUser.organization?.name || orgName,
        });
        alert(`Invite to ${email} has been sent!`); // Provide user feedback
      }

      // Close the modal and reset the state
      setModalOpen(false);
    } catch (error) {
      console.error("Error handling invite:", error);
      alert(error.message || "An error occurred while processing the invite."); // Provide user feedback
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setEmail(user.email);
    setRole(user.role);
    setIsEditMode(true);
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (selectedUser) {
      await deleteUser({ id: selectedUser.id });
      refetch();
      setDeleteModalOpen(false);
    }
  };

  const confirmDelete = (user) => {
    setSelectedUser(user);
    setDeleteModalOpen(true);
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case "SUPER_ADMIN":
        return "Super Admin";
      case "ORG_ADMIN":
        return "Organization Admin";
      case "ORG_MEMBER":
        return "Member";
      default:
        return "Unknown Role";
    }
  };

  const resetModal = () => {
    setTimeout(() => {
      setSelectedUser(null);
      setEmail("");
      setRole("ORG_MEMBER");
      setIsEditMode(false);
    }, 500);
  };

  return (
    <InnerLayout Nav={SettingsNav} childHeader="Members" ChildIcon={GrGroup}>
      <div className="max-w-3xl mx-auto flex flex-col gap-5 w-full">
        <div className="settings-header w-full">
          <h4 className="h4 font-medium">Members</h4>
          {isAdmin && (
            <button
              className="btn btn-primary"
              onClick={() => setModalOpen(true)}
            >
              Invite Member
            </button>
          )}
        </div>
        <div className="!mt-4 w-full h-fit max-h-[30rem] flex flex-col rounded-md location-inner-body border card-bg">
          {isLoading && <p>Loading...</p>}
          {isError && <p>Error loading users</p>}
          {users && users.length > 0 && (
            <div className="flex flex-col gap-5 mt-5 w-full">
              {users.map((user) => (
                <div
                  className="flex justify-between p-4 sm:flex-row flex-col gap-4 loc_card"
                  key={user.id}
                >
                  <div>
                    {user.name && (
                      <p>
                        <strong>{user.name}</strong>
                      </p>
                    )}
                    <h5>{user.email}</h5>
                    <p>{getRoleLabel(user.role)}</p>
                  </div>
                  {isAdmin && (
                    <div className="flex items-center gap-3">
                      <button
                        className="btn btn-outline"
                        title="Edit Now"
                        onClick={() => handleEdit(user)}
                      >
                        <LuPencilLine size={24} />
                      </button>
                      <button
                        className="btn btn-outline tomato-btn-bg"
                        onClick={() => confirmDelete(user)}
                      >
                        <RiDeleteBin6Line size={24} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          resetModal();
        }}
      >
        <div className="w-full flex flex-col items-center gap-5 px-0 pb-3 sm:px-6 sm:pb-6">
          <div className="mem-head w-full flex flex-col items-start">
            <h2 className="h5 font-medium text-left">
              {isEditMode ? "Edit Member" : "Invite Member"}
            </h2>
            <p className="text-left font-normal text-gray-500">
              Fill out the form below{" "}
              {isEditMode
                ? "to update member details"
                : "to invite new members to your team"}
            </p>
          </div>
          <form
            onSubmit={handleInvite}
            className="w-full flex flex-col items-center"
          >
            {!isEditMode && (
              <FormInput>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                  required
                />
              </FormInput>
            )}
            <FormInput>
              <label htmlFor="role">Role</label>
              <select
                name="role"
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="ORG_ADMIN">Organization Admin</option>
                <option value="ORG_MEMBER">Member</option>
              </select>
            </FormInput>
            {!isEditMode && !currentUser?.organization && (
              <FormInput>
                <label htmlFor="orgName">Organization Name</label>
                <input
                  type="text"
                  name="orgName"
                  id="orgName"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="Enter organization name"
                  required
                />
              </FormInput>
            )}
            <button type="submit" className="btn btn-primary">
              {isEditMode ? "Update Member" : "Invite Member"}
            </button>
          </form>
        </div>
      </Modal>
      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        userName={selectedUser?.name || "this user"}
      />
    </InnerLayout>
  );
};
