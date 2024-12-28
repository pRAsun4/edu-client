export const AvatarFunc = (name) => {

    let initials 
    
    if(name){
            initials = name
            .split(" ")
            .map((part) => part[0])
            .join("+");
    }

    return `https://eu.ui-avatars.com/api/?${initials && `name=${initials}&`}size=250&background='404040'&color='fff'`;
};