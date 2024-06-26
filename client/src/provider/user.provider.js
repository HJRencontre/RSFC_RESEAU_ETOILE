import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext(); // Créez un contexte UserContext

const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isFetched, setIsFetched] = useState(false);

  const updateUser = (newUser) => {
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsFetched(true);
    } else {
      const fetchData = async () => {
        try {
          fetch("/v1/api/users/me", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
            .then((res) => {
              return res.json();
            })
            .then((data) => {
              updateUser(data.user);
              setIsFetched(true);
            })
            .catch((err) => {
              console.log(err);
            });
        } catch (error) {
          console.error(
            "Erreur lors de la récupération des données de l'utilisateur:",
            error
          );
        }
      };
      if (!isFetched) {
        fetchData();
      }
    }
  }, [isFetched]);

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
