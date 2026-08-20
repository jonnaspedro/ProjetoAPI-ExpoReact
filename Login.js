import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
} from "react-native";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  async function entrar() {
    try {
      const resposta = await fetch(
        `https://cgdkhufktnclezagrhek.supabase.co/rest/v1/usuario?email=eq.${encodeURIComponent(
          email
        )}&senha=eq.${encodeURIComponent(senha)}`,
        {
          headers: {
            apikey:
              "sb_publishable_mM-GboZkenaIqZSfdJ-ivw_1ujgbpDQ",
          },
        }
      );

      const usuarios = await resposta.json();

      if (usuarios.length === 0) {
        Alert.alert(
          "Erro",
          "E-mail ou senha incorretos."
        );
        return;
      }

      navigation.replace("Notificacao");
    } catch (erro) {
      Alert.alert(
        "Erro",
        "Não foi possível fazer login."
      );
    }
  }

  return (
    <View style={{ padding: 30, marginTop: 50 }}>
      <Text style={{ fontSize: 28, fontWeight: "bold" }}>
        Login
      </Text>

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

      <Button
        title="Entrar"
        onPress={entrar}
      />

      <View style={{ marginTop: 15 }}>
        <Button
          title="Criar conta"
          onPress={() =>
            navigation.navigate("Cadastro")
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