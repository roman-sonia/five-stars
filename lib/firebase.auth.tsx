import { getAuth, GoogleAuthProvider, onIdTokenChanged, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import Router from 'next/router';
import { createContext, useContext, useEffect, useState } from 'react';
import { createUser } from './firebase.db';

interface AuthContext {
  user: any;
  loading: boolean;
  signinWithEmail: (email: string, password: string) => Promise<any>;
  signinWithGoogle: (redirect?: string) => Promise<any>;
  signout: () => Promise<any>;
}

const authContext = createContext<AuthContext>(undefined);

export function AuthProvider({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => {
  return useContext(authContext);
};

const auth = getAuth();

function useProvideAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log(user);


  const handleUser = async (rawUser) => {
    if (rawUser) {
      const user = await formatUser(rawUser);
      const { token, ...userWithoutToken } = user;

      createUser(user.uid, userWithoutToken);
      setUser(user);
      setLoading(false);
      return user;
    } else {
      setUser(false);
      setLoading(false);
      return false;
    }
  };

  const signinWithEmail = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password).then((response) => {
      handleUser(response.user);
      Router.push('/sites');
    });
  };

  const signinWithGoogle = (redirect) => {
    setLoading(true);
    return signInWithPopup(auth, new GoogleAuthProvider()).then((response) => {
      handleUser(response.user);

      if (redirect) {
        Router.push(redirect);
      }
    });
  };

  const signout = () => {
    Router.push('/');

    return signOut(auth).then(() => handleUser(false));
  };

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, handleUser);

    return () => unsubscribe();
  }, []);

  return {
    user,
    loading,
    signinWithEmail,
    signinWithGoogle,
    signout
  };
}

const formatUser = async (user) => {
  const token = await user.getIdToken();
  return {
    uid: user.uid,
    email: user.email,
    name: user.displayName,
    provider: user.providerData[0].providerId,
    photoUrl: user.photoURL,
    token
  };
};