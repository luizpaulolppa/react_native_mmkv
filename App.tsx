import { Text, View, TextInput, Button } from 'react-native';
import { useMMKV } from 'react-native-mmkv';

import { styles } from './styles';
import { useEffect, useState } from 'react';

type User = {
  name: string;
  email: string;
}

export default function App() {
  const storage = useMMKV({ id: 'myapp' })

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const [user, setUser] = useState<User>()

  function handleSave() {
    storage.set('user', JSON.stringify({
      name,
      email,
    }))
  }

  function fetchUser() {
    const data = storage.getString('user')
    setUser(data ? JSON.parse(data) : {})
  }

  useEffect(() => {
    fetchUser()
    const listener = storage.addOnValueChangedListener((changedKey) => {
      console.log('CHANGED KEY:', changedKey)
      fetchUser()
    })

    return () => listener.remove()
  }, [])

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Name"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        placeholder="E-mail"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />
      <Button title="Salvar" onPress={handleSave} />
      <Text style={styles.text}>
        {user?.name} - {user?.email}
      </Text>
    </View>
  );
}
