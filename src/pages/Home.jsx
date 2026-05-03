import { useState, useContext, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import { AuthContext } from "../context/Auth/AuthContext";

function Home() {
  const [username, setUsername] = useState("");
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    if (!currentUser) return;

    const fetchUsername = async () => {
      try {
        if (currentUser?.email) {
          const nameQuery = query(
            collection(db, "users"),
            where("email", "==", currentUser.email),
          );
          const querySnapshot = await getDocs(nameQuery);
          querySnapshot.forEach((doc) => {
            setUsername(doc.data().username);
          });
        }
      } catch (error) {
        alert(error.message);
      }
    };

    fetchUsername();
  }, [currentUser]);

  return (
    <div className="text-center mt-24 text-2xl font-medium">
      Hey, {username}
    </div>
  );
}

export default Home;
