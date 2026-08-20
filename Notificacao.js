import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  ScrollView,
} from "react-native";

import { Picker } from "@react-native-picker/picker";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function Notificacao({ navigation }) {
  const [usuarios, setUsuarios] = useState([]);
  const [usuario, setUsuario] = useState("");
  const [titulo, setTitulo] = useState("");
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    carregarUsuarios();
    pedirPermissao();
  }, []);

  async function pedirPermissao() {
    const { status } =
      await Notifications.requestPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permissão",
        "As notificações não foram autorizadas."
      );
    }
  }

  async function carregarUsuarios() {
    try {
      const resposta = await fetch(
        "https://cgdkhufktnclezagrhek.supabase.co/rest/v1/usuario?select=id,nome,token",
        {
          headers: {
            apikey:
              "sb_publishable_IPsf8cTazQXIOxTS-EvkdQ_G7bVSGCj",
          },
        }
      );

      if (!resposta.ok) {
        throw new Error("Erro ao buscar usuários.");
      }

      const dados = await resposta.json();

      setUsuarios(dados);

      if (dados.length > 0) {
        setUsuario(String(dados[0].id));
      }
    } catch (erro) {
      console.log("Erro ao carregar usuários:", erro);

      Alert.alert(
        "Erro",
        "Não foi possível carregar os usuários."
      );
    }
  }

  async function enviar() {
    if (!mensagem.trim()) {
      Alert.alert(
        "Erro",
        "Digite uma mensagem."
      );
      return;
    }

    if (!usuario) {
      Alert.alert(
        "Erro",
        "Selecione um usuário."
      );
      return;
    }

    try {
      const destinatario = usuarios.find(
        (item) =>
          String(item.id) === String(usuario)
      );

      if (!destinatario) {
        Alert.alert(
          "Erro",
          "Usuário não encontrado."
        );
        return;
      }

      if (!destinatario.token) {
        Alert.alert(
          "Erro",
          `${destinatario.nome} não possui um token de notificação.`
        );
        return;
      }

      const resposta = await fetch(
        "https://exp.host/--/api/v2/push/send",
        {
          method: "POST",

          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            to: destinatario.token,
            title: titulo || "Nova notificação",
            body: mensagem,
            sound: "default",
          }),
        }
      );

      const resultado = await resposta.json();

      console.log(
        "Resposta da Expo:",
        resultado
      );

      if (!resposta.ok) {
        throw new Error(
          resultado?.errors?.[0]?.message ||
            "Erro ao enviar a notificação."
        );
      }

      if (
        resultado?.data?.status === "error"
      ) {
        throw new Error(
          resultado?.data?.message ||
            "A Expo não conseguiu enviar a notificação."
        );
      }

      Alert.alert(
        "Sucesso",
        `Notificação enviada para ${destinatario.nome}!`
      );

      setTitulo("");
      setMensagem("");
    } catch (erro) {
      console.log(
        "Erro ao enviar:",
        erro
      );

      Alert.alert(
        "Erro",
        erro.message ||
          "Não foi possível enviar a notificação."
      );
    }
  }

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 30,
        paddingTop: 50,
        paddingBottom: 50,
      }}
      keyboardShouldPersistTaps="handled"
    >
      <Text
        style={{
          fontSize: 26,
          fontWeight: "bold",
          marginBottom: 20,
        }}
      >
        Enviar Notificação
      </Text>

      <Text>Usuário</Text>

      <View
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          marginVertical: 10,
        }}
      >
        <Picker
          selectedValue={usuario}
          onValueChange={(valor) =>
            setUsuario(valor)
          }
        >
          {usuarios.map((item) => (
            <Picker.Item
              key={item.id}
              label={item.nome}
              value={String(item.id)}
            />
          ))}
        </Picker>
      </View>

      <Text>Título</Text>

      <TextInput
        value={titulo}
        onChangeText={setTitulo}
        placeholder="Digite o título"
        style={estilo}
      />

      <Text>Mensagem</Text>

      <TextInput
        value={mensagem}
        onChangeText={setMensagem}
        placeholder="Digite a mensagem"
        multiline
        textAlignVertical="top"
        style={{
          ...estilo,
          height: 120,
        }}
      />

      <Button
        title="Enviar Notificação"
        onPress={enviar}
      />

      <View style={{ marginTop: 20 }}>
        <Button
          title="Sair"
          onPress={() =>
            navigation.replace("Login")
          }
        />
      </View>
    </ScrollView>
  );
}

const estilo = {
  borderWidth: 1,
  borderColor: "#ccc",
  padding: 10,
  marginVertical: 10,
  borderRadius: 5,
};