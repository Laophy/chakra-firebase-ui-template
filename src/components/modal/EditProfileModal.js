import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  HStack,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

export default function EditProfileModal({
  profile,
  user,
  attemptSaveChanges,
  attemptMute,
  attemptBan,
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [updatedProfile, setUpdatedProfile] = useState(profile);

  useEffect(() => {
    setUpdatedProfile(profile);
  }, [profile]);

  const handleSaveChanges = async () => {
    await attemptSaveChanges(updatedProfile);
    onClose();
  };

  const handleMute = () => {
    attemptMute();
    onClose();
  };

  const handleBan = () => {
    attemptBan();
    onClose();
  };

  return (
    <>
      {(user?.isStaff || user?.uid === profile?.uid) && (
        <Button onClick={onOpen} width="full" mt={4} alignSelf="center">
          Edit Profile
        </Button>
      )}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Profile</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel>Username</FormLabel>
                <Input
                  placeholder="Enter username"
                  value={updatedProfile?.username || ""}
                  onChange={(e) =>
                    setUpdatedProfile({
                      ...updatedProfile,
                      username: e.target.value,
                    })
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Photo URL</FormLabel>
                <Input
                  placeholder="Enter photo URL"
                  value={updatedProfile?.photoURL || ""}
                  onChange={(e) =>
                    setUpdatedProfile({
                      ...updatedProfile,
                      photoURL: e.target.value,
                    })
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Bio</FormLabel>
                <Textarea
                  placeholder="Enter bio"
                  value={updatedProfile?.bio || ""}
                  onChange={(e) =>
                    setUpdatedProfile({
                      ...updatedProfile,
                      bio: e.target.value,
                    })
                  }
                />
              </FormControl>
              {user?.isHighStaff && (
                <HStack spacing={4} align="stretch">
                  <FormControl flex={1}>
                    <FormLabel>Title</FormLabel>
                    <Input
                      placeholder="Enter title"
                      value={updatedProfile?.title?.title || ""}
                      onChange={(e) =>
                        setUpdatedProfile({
                          ...updatedProfile,
                          title: {
                            ...updatedProfile?.title,
                            title: e.target.value,
                          },
                        })
                      }
                    />
                  </FormControl>
                  <FormControl flex={1}>
                    <FormLabel>Title Color</FormLabel>
                    <Input
                      placeholder="Enter title color"
                      value={updatedProfile?.title?.color || ""}
                      onChange={(e) =>
                        setUpdatedProfile({
                          ...updatedProfile,
                          title: {
                            ...updatedProfile?.title,
                            color: e.target.value,
                          },
                        })
                      }
                    />
                  </FormControl>
                </HStack>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <HStack width="full" justify="space-between">
              <Button colorScheme="blue" onClick={handleSaveChanges}>
                Save
              </Button>
              {user?.isHighStaff && user?.uid !== profile?.uid && (
                <HStack spacing={3}>
                  <Button colorScheme="purple" onClick={handleMute}>
                    Mute
                  </Button>
                  <Button colorScheme="red" onClick={handleBan}>
                    Ban
                  </Button>
                </HStack>
              )}
              {user?.isStaff &&
                !user?.isHighStaff &&
                user?.uid !== profile?.uid && (
                  <HStack spacing={3}>
                    {(!profile?.isStaff ||
                      (profile?.isStaff && !profile?.isHighStaff)) && (
                      <>
                        <Button colorScheme="purple" onClick={handleMute}>
                          Mute
                        </Button>
                        <Button colorScheme="red" onClick={handleBan}>
                          Ban
                        </Button>
                      </>
                    )}
                  </HStack>
                )}
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
