import { db } from "../../firebase";
import Sidebar from "../components/Sidebar";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/Auth/AuthContext";
import ExpandedContactView from "../components/ExpandedContactView";
import { collection, getDocs, query, where } from "firebase/firestore";

function Home() {
  const [username, setUsername] = useState("");
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    if (!currentUser) return;

    // Fetch username
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
    <div className="flex bg-neutral-900 h-full transition-all duration-200 items-center justify-center">
      <Sidebar />
      <ExpandedContactView />
    </div>
  );
}

export default Home;
