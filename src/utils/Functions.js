import { useMemo } from "react";

export const AvatarFunc = (name) => {
  let initials;

  if (name) {
    initials = name
      .split(" ")
      .map((part) => part[0])
      .join("+");
  }

  return `https://eu.ui-avatars.com/api/?${initials&&`name=${initials}&`}size=250&background='404040'&color='fff'`;
};

export const getPaginatedData = (data = [], currentPage, itemsPerPage) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = data.slice(startIndex, endIndex);

  return {
    paginatedData,
    totalPages: Math.ceil(data.length / itemsPerPage),
    hasNextPage: endIndex < data.length,
    hasPreviousPage: currentPage > 1,
    startIndex,
    endIndex,
  };
};

export const useUserEmailPart = (user) => {
  return useMemo(() => {
    if (!user?.email) return null;
    return user.email.slice(0, user.email.indexOf("@"));
  }, [user]);
};
