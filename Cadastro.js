import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
} from "react-native";

import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";

export default function Cadastro({ navigation }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    pegarToken();
  }, []);

  async function pegarToken() {
    if (!Device.isDevice) {
      Alert.alert("Erro", "Use um celular físico.");
      return;
    }

    const { status } =
      await Notifications.requestPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Erro", "Permissão negada.");
      return;
    }

    const projectId =
      Constants.expoConfig?.extra?.eas?.projectId ||
      Constants.easConfig?.projectId;

    const resposta =
      await Notifications.getExpoPushTokenAsync({
        projectId,
      });

    setToken(resposta.data);
  }

  async function cadastrar() {
    if (!nome || !email || !senha) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    try {
      const resposta = await fetch(
        "https://cgdkhufktnclezagrhek.supabase.co/rest/v1/usuario",
        {
          method: "POST",

          headers: {
            apikey:
              "sb_publishable_IPsf8cTazQXIOxTS-EvkdQ_G7bVSGCj",
            "Content-Type": "application/json",
            Prefer: "return=representation",
          },

          body: JSON.stringify({
            nome,
            email,
            senha,
            token,
          }),
        }
      );

      if (!resposta.ok) {
        throw new Error("Erro ao cadastrar.");
      }

      Alert.alert(
        "Sucesso",
        "Usuário cadastrado!",
        [
          {
            text: "OK",
            onPress: () =>
              navigation.navigate("Login"),
          },
        ]
      );
    } catch (erro) {
      Alert.alert("Erro", erro.message);
    }
  }

  return (
    <View style={{ padding: 30, marginTop: 50 }}>
      <Text style={{ fontSize: 28, fontWeight: "bold" }}>
        Cadastro
      </Text>

      <Text>Nome</Text>
      <TextInput
        value={nome}
        onChangeText={setNome}
        placeholder="Digite seu nome"
        style={estilo}
      />

      <Text>E-mail</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Digite seu e-mail"
        style={estilo}
      />

      <Text>Senha</Text>
      <TextInput
        value={senha}
        onChangeText={setSenha}
        placeholder="Digite sua senha"
        secureTextEntry
        style={estilo}
      />

      <Text>Token</Text>
      <TextInput
        value={token}
        editable={false}
        placeholder="Obtendo token..."
        style={estilo}
      />

      <Button
        title="Cadastrar"
        onPress={cadastrar}
      />

      <View style={{ marginTop: 15 }}>
        <Button
          title="Já tenho uma conta"
          onPress={() =>
            navigation.navigate("Login")
          }
        />
      </View>
    </View>
  );
}

const estilo = {
  borderWidth: 1,
  borderColor: "#ccc",
  padding: 10,
  marginBottom: 15,
};