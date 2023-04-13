import {
  QueryClient,
  QueryClientProvider,
} from "react-query";
import Pokemon from "./Pokemon";



const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Pokemon />
    </QueryClientProvider>
  )
}