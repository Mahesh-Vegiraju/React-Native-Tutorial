import { useEffect, useState } from "react";
import { getAllPosts } from "./appwrite";
import { Alert } from "react-native";

const useAppwrite = (fn: () => any) => {
  const [data, setData] = useState([])
  const [isLoading, setisLoading] = useState(true)

  const fetchData = async () => {
    setisLoading(true);
    try {
      const res = await fn();
      setData(res);
    } catch (error) {
      Alert.alert('Error', String(error))
    } finally {
      setisLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const refetch = () => fetchData();

  return { data, isLoading, refetch }
}

export default useAppwrite;