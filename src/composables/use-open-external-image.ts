export const useOpenExternalImage = () => {
  const router = useRouter()

  const openExternalImage = (payload: { url: string; fileName?: string }) => {
    const { url, fileName } = payload
    const path = router.resolve({
      name: RouteNames[Routes.resource.image],
      query: {
        url,
        name: fileName || url,
      },
    })

    window.open(path.fullPath, '_blank')
  }

  return { openExternalImage }
}
