import { Container, Heading, Stack, Text, Avatar, Box } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { getfirebaseUser } from "../../services/UserManagement.service";
import { useEffect, useState } from "react";
import { formatMoney } from "../../utilities/Formatter";

export default function UserProfile() {
  // Grabbing a user from global storage via redux
  const user = useSelector((state) => state.data.user.user);
  // Grabbing uid from URL parameters
  const { uid } = useParams();

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    loadCurrentUser();
  }, [uid]);

  const loadCurrentUser = async () => {
    const [userData, mtsResponse] = await getfirebaseUser({ uid });
    if (mtsResponse || !userData) {
      // something went wrong
      console.log("MTS RESPONSE!!");
    } else {
      // when the user has data in the DB use that as the main override
      console.log("USER DATA: ", userData);
      setProfile(userData);
    }
  };

  return (
    <Container as={Stack} maxW={"6xl"} py={10}>
      <Stack
        alignItems={"center"}
        justifyContent={"center"}
        flexWrap={"wrap"}
        flexDirection={"column"}
        spacing={5}
      >
        <Avatar size="3xl" name={profile?.username} src={profile?.photoURL} />
        <Heading as="h3" size="lg">
          {profile?.username}
        </Heading>
        <Text fontSize="xl" color={"gray.500"}>
          {profile?.username}
        </Text>
        <Box textAlign="center" mt={5}>
          <Text fontSize="md" color={"gray.600"}>
            {formatMoney(profile?.balance)}
          </Text>
        </Box>
      </Stack>
    </Container>
  );
}
