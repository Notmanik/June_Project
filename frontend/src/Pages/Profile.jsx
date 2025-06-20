const Profile = () => {
    const token = localStorage.getItem("token");
      let username = "";
      
      if (token) {
        try {
          const decoded = jwtDecode(token);
          username = decoded.username;
        } catch (err) {
          console.error("Invalid token:", err);
        }
      }
    return (
        <h1>This is the user Profile</h1>
    )
}