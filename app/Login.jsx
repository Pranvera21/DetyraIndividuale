import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Button,
  TextInput,
  Text,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { auth } from "../firebaseConfig";
import { GoogleAuthProvider, signInWithCredential, onAuthStateChanged, signOut } from "firebase/auth";
import * as AuthSession from "expo-auth-session";

console.log("Redirect URI:", AuthSession.makeRedirectUri({ useProxy: true }));



WebBrowser.maybeCompleteAuthSession();

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: "422777488883-h7apovjp6af5vla7pa6br64tvclftr7i.apps.googleusercontent.com",
    webClientId: "422777488883-h7apovjp6af5vla7pa6br64tvclftr7i.apps.googleusercontent.com",
   
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        console.log("User is signed in:", user.email);
      } else {
        console.log("User is signed out");
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (response?.type === "success") {
      setLoading(true);
      const { id_token, access_token } = response.params;
      
      if (!id_token) {
        Alert.alert("Error", "No ID token received from Google");
        setLoading(false);
        return;
      }

      const credential = GoogleAuthProvider.credential(id_token, access_token);
      
      signInWithCredential(auth, credential)
        .then((userCredential) => {
          setLoading(false);
          Alert.alert(
            "Success!", 
            `Welcome ${userCredential.user.displayName || userCredential.user.email}!`
          );
        })
        .catch((error) => {
          setLoading(false);
          console.error("Sign in error:", error);
          Alert.alert(
            "Login Error", 
            error.message || "Failed to sign in with Google. Please try again."
          );
        });
    } else if (response?.type === "error") {
      setLoading(false);
      Alert.alert(
        "Authentication Error",
        response.error?.message || "Failed to authenticate with Google"
      );
    } else if (response?.type === "cancel") {
      setLoading(false);
      console.log("User cancelled the login flow");
    }
  }, [response]);

  const handleSignIn = async () => {
    try {
      await promptAsync();
    } catch (error) {
      console.error("Prompt error:", error);
      Alert.alert("Error", "Failed to start Google sign-in");
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      Alert.alert("Success", "You have been signed out");
    } catch (error) {
      console.error("Sign out error:", error);
      Alert.alert("Error", "Failed to sign out");
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4285F4" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {user ? (
        <View style={styles.userContainer}>
          <Text style={styles.welcomeText}>
            Welcome back, {user.displayName || user.email || username}!
          </Text>
          <Button
            title="Sign Out"
            onPress={handleSignOut}
            color="#DB4437"
          />
        </View>
      ) : (
        <View style={styles.form}>
          <Text style={styles.heading}>Already have an account?</Text>
          <Text style={styles.subHeading}>
            Enter your email and username to continue.
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            returnKeyType="next"
          />
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            returnKeyType="done"
          />
          <Text style={styles.dividerText}>or</Text>
          <Text style={styles.subHeading}>New here? You can sign up with Google.</Text>
          <Button
            disabled={
              !request
            }
            title="Login with Google"
            onPress={handleSignIn}
            color="#4285F4"
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  userContainer: {
    alignItems: "center",
    gap: 16,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  form: {
    width: "100%",
    maxWidth: 320,
    gap: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
  },
  subHeading: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  dividerText: {
    textAlign: "center",
    color: "#999",
  },
});
