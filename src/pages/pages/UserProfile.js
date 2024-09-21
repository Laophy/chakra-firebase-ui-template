import {
  Container,
  Stack,
  Spinner,
  useBreakpointValue,
  useToast,
  useClipboard,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getfirebaseUser,
  updateUser,
} from "../../services/UserManagement.service";

import ProfileCard from "../../components/profile/ProfileCard";

export default function UserProfile() {
  const user = useSelector((state) => state.data.user.user);
  const { uid } = useParams();
  const [profile, setProfile] = useState(null);
  const toast = useToast();
  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    loadCurrentUser();
  }, [uid]);

  const loadCurrentUser = async () => {
    const [userData, mtsResponse] = await getfirebaseUser({ uid });
    console.log(userData);
    if (mtsResponse || !userData) {
      setProfile(null);
    } else {
      setProfile(userData);
    }
  };

  const showToast = (title, description, status) => {
    toast({
      title,
      description,
      status,
      duration: 2000,
      isClosable: true,
    });
  };

  const attemptSaveChanges = async (updatedProfile) => {
    try {
      const [res] = await updateUser(user, profile.uid, updatedProfile);
      if (res) {
        setProfile(updatedProfile);
        showToast("Success", "Profile changes saved successfully", "success");
      }
      return true;
    } catch (e) {
      showToast("Error", "Failed to save profile changes", "error");
      return false;
    }
  };

  const attemptMute = async () => {
    try {
      showToast("Success", "Profile muted successfully", "success");
    } catch (e) {
      showToast("Error", "Failed to mute", "error");
    }
  };

  const attemptBan = async () => {
    try {
      showToast("Success", "Profile banned successfully", "success");
    } catch (e) {
      showToast("Error", "Failed to ban", "error");
    }
  };

  return (
    <Container
      as={Stack}
      maxW={"6xl"}
      py={10}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Stack alignItems={"center"} justifyContent={"center"} w={"full"}>
        <Stack
          w={"full"}
          direction={isMobile ? "column" : "row"}
          alignItems="center" // Center the ProfileCard horizontally
          justifyContent="center" // Center the ProfileCard vertically
        >
          <ProfileCard
            profile={profile}
            user={user}
            isMobile={isMobile}
            attemptSaveChanges={attemptSaveChanges}
            attemptMute={attemptMute}
            attemptBan={attemptBan}
          />
        </Stack>
      </Stack>
    </Container>
  );
}
