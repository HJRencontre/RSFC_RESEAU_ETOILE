import { AnimatePresence } from "framer-motion";
import AuthProvider from "./provider/auth.provider";
import UserContextProvider from "./provider/user.provider";
import Routes from "./router";

const App = () => {
  return (
    <AuthProvider>
      <UserContextProvider>
        <AnimatePresence mode="wait">
          <Routes />
        </AnimatePresence>
      </UserContextProvider>
    </AuthProvider>
  );
};

export default App;
