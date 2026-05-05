"use cliente";

import {useRouter} from 'next/navigation'

export default function BotonRegresar(){
    const router = useRouter()

    return (
    <button
      type="button"
      onClick={() => router.back()}
      className="mt-8 inline-flex rounded-full bg-green-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-green-700"
    >
      Volver atrás
    </button>
  );
}