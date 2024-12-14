'use client';
import { Provider } from 'react-redux';
import store from "../../store/index";
import Navbar from "@/components/Navbar";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const ClientWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <div className="container mx-auto min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow w-full mt-20 pt-4">{children}</main>
          <footer className="py-2 text-center text-primaryBlue">
            © 2024 AI_Friend, All Rights Reserved
          </footer>
        </div>
      </Provider>
    </QueryClientProvider>
  );
};

export default ClientWrapper;
