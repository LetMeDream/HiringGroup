import { useState } from 'react';
import { endpoints } from '@/constants/endpoints';
import axios from 'axios';
import { UserFormData, EmpresaFormData } from '../components/dashboards/EmpresaOnboardingForm';
import { useStore } from '@/store/store';

export function useEmpresaOnboarding(onSubmitEmpresa: (data: EmpresaFormData) => void) {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState<UserFormData | null>(null);
  const [userCreated, setUserCreated] = useState(false);
  const { setUsuarioEmpresa } = useStore();

  const handleUserStep = async (data: UserFormData) => {
    if (userCreated) {
      setUserData(data);
      setStep(2);
      return;
    }
    const baseUrl = endpoints.base + endpoints.registerUser;
    try {
      const res = await axios.post(baseUrl, data);
      if (res.status === 200 || res.status === 201) {
        setUserData(res.data);
        setUsuarioEmpresa(res.data)
        setUserCreated(true);
        setStep(2);
      }
    } catch (error) {
      // Manejo de error opcional
    }
  };

  const handleEmpresaStep = (empresaData: EmpresaFormData) => {
    if (userData) {
      onSubmitEmpresa({ ...empresaData });
    }
  };

  return {
    step,
    setStep,
    userData,
    userCreated,
    handleUserStep,
    handleEmpresaStep
  };
}
