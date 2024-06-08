import { View, Text, ScrollView, Touchable, TouchableOpacity, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import FormField from '@/components/formField'
import { title } from 'process'
import { Video, ResizeMode } from 'expo-av'
import { icons } from '@/constants'
import CustomButton from '@/components/customButton'
import * as ImagePicker from 'expo-image-picker'
import { createVideo } from '@/lib/appwrite'
import { router } from 'expo-router'
import { useGlobalContext } from '@/context/GlobalProvider'

const Create = () => {
  const { user } = useGlobalContext();
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    video: null,
    thumbnail: null,
    prompt: '',
  })

  const openPicker = async (selectType:string) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: selectType === 'video' ? ImagePicker.MediaTypeOptions.Videos : ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.canceled) {
      if (selectType === 'video') {
        setForm({ ...form, video: result.assets[0] })
      } else {
        setForm({ ...form, thumbnail: result.assets[0] })
      }
    }
  }

  const submit = async () => {
    if (!form.prompt || !form.title || !form.video || !form.thumbnail) {
      return Alert.alert('Please fill out all fields')
    }

    setUploading(true)

    try {
      await createVideo({
        ...form, userId: user.$id
      })

      Alert.alert('Success', 'Post uploaded successfully')
      router.push('/home')
    } catch (error:any) {
      Alert.alert('Error', String(error.message))
    } finally {
      setForm({ title: '', video: null, thumbnail: null, prompt: '' })
      setUploading(false)
    }
  }

  return (
    <SafeAreaView className='bg-primary h-full'>
      <ScrollView className='px-4 my-6'>
        <Text className='text-2xl text-white font-psemibold'>Upload a Video</Text>
        <FormField 
          title='Video Title' 
          value={form.title} 
          placeholder='Give your video a catchy title' 
          handleChangeText={(e:any) => setForm({ ...form, title: e })} 
          otherStyles="mt-10" 
        />

        <View className='mt-7 space-y-2'>
          <Text className='text-base text-gray-100 font-pmedium'>Upload a video</Text>

          <TouchableOpacity onPress={() => openPicker('video')}>
            {form.video ? (
              <Video
                source={{ uri: form.video.uri }}
                className='w-3ull h-64 rounded-2xl'
                resizeMode={ResizeMode.COVER}
              />
            ) : (
              <View className='w-full h-40 px-4 bg-black-100 rounded-2xl justify-center items-center'>
                <View className='w-14 h-14 border border-dashed border-secondary-100 justify-center items-center'>
                  <Image
                    source={icons.upload}
                    resizeMode='contain'
                    className='w-1/2 h-1/2'
                  />

                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View className='mt-7 space-y-2'>
          <Text className='text-base text-gray-100 font-pmedium'>Upload a thumbnail</Text>

          <TouchableOpacity onPress={() => openPicker('image')}>
            {form.thumbnail ? (
              <Image
                source={{ uri: form.thumbnail.uri }}
                className='w-full h-64 rounded-2xl'
                resizeMode={ResizeMode.COVER}
              />
            ) : (
              <View className='w-full h-16 px-4 bg-black-100 rounded-2xl justify-center items-center border-2 border-black-200 flex-row space-x-2'>
                  <Image
                    source={icons.upload}
                    resizeMode='contain'
                    className='w-5 h-5'
                  />
                  <Text className='text-sm text-gray-100 font-pmedium'>
                    Choose a file
                  </Text>

              </View>
            )}
          </TouchableOpacity>
        </View>

        <FormField 
          title='AI Prompt' 
          value={form.prompt} 
          placeholder='The promt used to generate the video'
          handleChangeText={(e:any) => setForm({ ...form, prompt: e })} 
          otherStyles="mt-7"
        />

        <CustomButton 
          title='Submit & Upload'
          handlePress={submit}
          containerStyles={"mt-7"}
          isLoading={uploading}
        />
      </ScrollView>
    </SafeAreaView>
  )
}

export default Create