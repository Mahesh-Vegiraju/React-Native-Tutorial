import { View, Text, ScrollView, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import { images } from '../../constants'
import FormField from '@/components/formField'
import CustomButton from '@/components/customButton'
import { Link, router } from 'expo-router'
import { createUser } from '../../lib/appwrite'
import { useGlobalContext } from '@/context/GlobalProvider'

const SignUp = () => {
  const [form, setForm] = useState({
    username:'',
    email:'',
    password:'',
  })

  const [isSubmitting, setisSubmitting] = useState(false)
  const { setUser, setIsLogged } = useGlobalContext();

  const submit = async () => {
    if (!form.username || !form.email || !form.password) {
      Alert.alert('Error', 'Please in fill in all fields')
    }

    setisSubmitting(true);

    try {
      const result = await createUser(form.email, form.password, form.username);

      setUser(result);
      setIsLogged(true);

      router.replace('/home')
    } catch (error) {
      Alert.alert('Error', String(error))
    } finally {
      setisSubmitting(false);
    }
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[8vh]  px-4 my-6">
          <Image source={images.logo} resizeMode='contain' className="w-[115px] h-[35px]"/>
          <Text className="text-2xl text-white text-semibold mt-10 font-psemibold">Sign up to Aora</Text>

          <FormField 
            title="Username"
            value={form.username}
            handleChangeText={(e:any) => setForm({ ...form,
              username: e})}
            otherStyles="mt-10"
          />

          <FormField 
            title="Email"
            value={form.email}
            handleChangeText={(e:any) => setForm({ ...form,
              email: e})}
            otherStyles="mt-7"
            keyboardType="email-address"
          />
          <FormField 
            title="Password"
            value={form.password}
            handleChangeText={(e:any) => setForm({ ...form,
              password: e})}
            otherStyles="mt-7"
          />

          <CustomButton
            title="Sign Up"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignUp