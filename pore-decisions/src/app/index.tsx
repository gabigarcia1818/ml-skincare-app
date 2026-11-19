
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export default function HomeScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  async function login() {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      Alert.alert('Login failed', error.message);
    }
  }

  async function logout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      Alert.alert('Logout failed', error.message);
    }
  }

  if (session) {
    return (
      <View style={{ flex: 1, padding: 40, paddingTop: 100, backgroundColor: 'white' }}>
        <Text style={{ fontSize: 24 }}>Logged in!</Text>
        <Text>Welcome, {session.user.email}</Text>
        <Button title="Log Out" onPress={logout} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 40, paddingTop: 100, backgroundColor: 'white' }}>
      <Text>Email</Text>
      <TextInput
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={{ borderWidth: 1, padding: 10, marginBottom: 15 }}
      />

      <Text>Password</Text>
      <TextInput
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, padding: 10, marginBottom: 15 }}
      />

      <Button title="Log In" onPress={login} />
    </View>
  );
}
