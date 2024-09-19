import { AttachmentIcon, CheckCircleIcon } from "@chakra-ui/icons";
import {
  Text,
  Stack,
  HStack,
  Input,
  Button,
  Avatar,
  VStack,
  CardBody,
  Card,
  GridItem,
  Grid,
  useColorMode,
  ButtonGroup,
  IconButton,
  Divider,
  useColorModeValue,
  Image,
} from "@chakra-ui/react";
import moment from "moment";
import { useState } from "react";
import { useSelector } from "react-redux";

export default function DepositFunds() {
  // Grabbing a user from global storage via redux
  const user = useSelector((state) => state.data.user.user);

  const [referralCode, setReferralCode] = useState(
    user?.referralCode ? user?.referralCode : null
  );
  const [walletType, setWalletType] = useState(null);
  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue("gray.100", "gray.600");

  const onSetReferralCode = () => {
    // Update user referral code (the users uid)
    alert(referralCode);
    // Submit request to look up the referral code based on all available codes currently
    // If valid code save and update UI 24 hour cooldown
    // If no code found show breadcrumbs with information and keep input valid.
  };

  const determinDepositScreen = () => {
    if (!walletType) {
      return determinePaymentScreen();
    } else {
      return (
        <>
          <HStack>
            <Avatar
              size={"2xl"}
              m={1}
              name="BTC"
              src="https://static-00.iconduck.com/assets.00/bitcoin-icon-2048x2048-t8gwld81.png"
            />
            <VStack alignItems={"left"}>
              <Text fontSize="sm" as={"b"}>
                Your Bitcoin Address
              </Text>
              <ButtonGroup size="sm" isAttached variant="outline">
                <Input placeholder={user?.uid} size="md" />
                <IconButton
                  aria-label="Copy to Clipboard"
                  size="md"
                  icon={<AttachmentIcon />}
                />
              </ButtonGroup>

              <Text fontSize="xs" as="b">
                Send Bitcoin to this address to receive the current USD value in
                PackDraw credit.The minimum transfer value is $5. Transfers
                below $5 will not be credited to your account and will not be
                returned.
              </Text>
            </VStack>
          </HStack>
        </>
      );
    }
  };

  const determinePaymentScreen = () => {
    return (
      <>
        <Text fontSize="sm" as={"b"}>
          Crypto
        </Text>
        <Grid templateColumns="repeat(3, 1fr)" gap={2}>
          <GridItem w="100%" onClick={() => setWalletType("BTC")}>
            <Card bg={bg}>
              <CardBody>
                <VStack>
                  <Image
                    name="BTC"
                    src="https://static-00.iconduck.com/assets.00/bitcoin-icon-2048x2048-t8gwld81.png"
                  />
                  <Text>BTC</Text>
                </VStack>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem w="100%" onClick={() => setWalletType("ETH")}>
            <Card bg={bg}>
              <CardBody>
                <VStack>
                  <Image
                    name="ETH"
                    src="https://www.iconarchive.com/download/i109534/cjdowner/cryptocurrency-flat/Ethereum-ETH.1024.png"
                  />
                  <Text>ETH</Text>
                </VStack>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem w="100%" onClick={() => setWalletType("LTC")}>
            <Card bg={bg}>
              <CardBody>
                <VStack>
                  <Image
                    name="LTC"
                    src="https://cryptologos.cc/logos/litecoin-ltc-logo.png"
                  />
                  <Text>LTC</Text>
                </VStack>
              </CardBody>
            </Card>
          </GridItem>

          {/* <GridItem w="100%" onClick={() => setWalletType("SOL")}>
            <Card bg={bg}>
              <CardBody>
                <VStack>
                  <Image
                    name="SOL"
                    src="https://upload.wikimedia.org/wikipedia/en/b/b9/Solana_logo.png"
                  />
                  <Text>SOL</Text>
                </VStack>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem w="100%" onClick={() => setWalletType("XRP")}>
            <Card bg={bg}>
              <CardBody>
                <VStack>
                  <Image
                    name="XRP"
                    src="https://static-00.iconduck.com/assets.00/xrp-cryptocurrency-icon-2048x2048-2a0bicgj.png"
                  />
                  <Text>XRP</Text>
                </VStack>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem w="100%" onClick={() => setWalletType("DOGE")}>
            <Card bg={bg}>
              <CardBody>
                <VStack>
                  <Image
                    name="DOGE"
                    src="https://static-00.iconduck.com/assets.00/dogecoin-cryptocurrency-icon-2048x2048-6zhekr7g.png"
                  />
                  <Text>DOGE</Text>
                </VStack>
              </CardBody>
            </Card>
          </GridItem>

          <GridItem w="100%" onClick={() => setWalletType("USDT")}>
            <Card bg={bg}>
              <CardBody>
                <VStack>
                  <Image
                    name="USDT"
                    src="https://static-00.iconduck.com/assets.00/tether-cryptocurrency-icon-2048x2048-dp13oydi.png"
                  />
                  <Text>USDT</Text>
                </VStack>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem w="100%" onClick={() => setWalletType("SHIB")}>
            <Card bg={bg}>
              <CardBody>
                <VStack>
                  <Image
                    name="SHIB"
                    src="https://upload.wikimedia.org/wikipedia/en/5/53/Shiba_Inu_coin_logo.png"
                  />
                  <Text>SHIB</Text>
                </VStack>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem w="100%" onClick={() => setWalletType("USDC")}>
            <Card bg={bg}>
              <CardBody>
                <VStack>
                  <Image
                    name="USDC"
                    src="https://cryptologos.cc/logos/usd-coin-usdc-logo.png"
                  />
                  <Text>USDC</Text>
                </VStack>
              </CardBody>
            </Card>
          </GridItem> */}
        </Grid>
        <Text fontSize="sm" as={"b"} mt={2}>
          Card
        </Text>
        <Grid templateColumns="repeat(1, 1fr)">
          <GridItem w="100%" onClick={() => setWalletType("CC")}>
            <Card bg={bg}>
              <CardBody>
                <VStack>
                  <Avatar
                    name="CC"
                    src="https://cdn-icons-png.flaticon.com/512/6963/6963703.png"
                  />
                  <Text>Credit Card</Text>
                </VStack>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
        <Text fontSize="xs" style={{ textAlign: "center" }} mt={1} mb={1}>
          Cryptocurrency deposits are generally credited after 3 confirmations.
          Please allow up to 30 minutes for funds to appear in your account. In
          most cases, funds will appear within 5 minutes. There is no mechanism
          to withdraw deposited funds. All funds must be used to purchase.
          Credit card deposits are not eligible for deposit bonuses and are
          subject to card verification.
        </Text>
      </>
    );
  };

  return (
    <Stack>
      {determinDepositScreen()}
      {user?.referralCode ? (
        <>
          <HStack alignItems={"center"} justifyContent={"space-between"} mt={5}>
            <Text fontSize="sm" as={"b"}>
              Using Referral Code: {user?.referralCode}
            </Text>
            <HStack>
              <CheckCircleIcon color={"teal"} />
              <Text fontSize="sm" as={"b"}>
                5% Deposit Bonus Is Active
              </Text>
            </HStack>
          </HStack>
          <Divider m={2} />
          <Text
            fontSize="sm"
            as={"b"}
            style={{ textAlign: "center", color: "lightgray" }}
            mb={1}
          >
            You are eligible to use a new code{" "}
            {moment(
              new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
            ).fromNow()}
          </Text>
        </>
      ) : (
        <HStack m={2}>
          <Input
            placeholder="Enter Referral Code"
            size="md"
            onChange={(e) => setReferralCode(e.target.value)}
          />
          <Button
            size="md"
            variant={"solid"}
            colorScheme={"teal"}
            onClick={() => onSetReferralCode()}
          >
            Submit
          </Button>
        </HStack>
      )}
    </Stack>
  );
}
