const { createContext, useState, useEffect } = require("react");
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const fetchProfile = async () => {
    let res = await fetch("http://localhost:5000/api/user/profile", {
      method: "GET",
      credentials: "include",
    });
    let result = await res.json();
    if (res.status !== 401) {
      setUser(result);
      // fetchOrders(result);
    }
  };

  // const fetchOrders = async (user) => {
  //   if (user) {
  //     let res = await fetch(`http://localhost:5000/api/order/getOrders/${user._id}?status=Pending`);
  //     let result = await res.json();
  //     localStorage.setItem("orders", JSON.stringify(result));
  //   }
  // };

  useEffect(() => {
    fetchProfile();
  }, []);

  const login = async (email, password) => {
    const res = await fetch("http://localhost:5000/api/user/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (res.status === 400) return res;
    let result = await res.json();
    setUser(result.data);
    // fetchOrders(result.data);
  };

  const logout = async () => {
    await fetch("http://localhost:5000/api/user/logout", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    setUser(null);
    // localStorage.removeItem("orders")
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
