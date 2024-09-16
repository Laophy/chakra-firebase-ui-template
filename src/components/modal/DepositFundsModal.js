import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import DepositFunds from "../wallet/DepositFunds";

export default function DepositFundsModal({
  isDepositOpen,
  onDepositOpen,
  onDepsoitClose,
}) {
  // Grabbing a user from global storage via redux
  const user = useSelector((state) => state.data.user.user);

  return (
    <Modal isOpen={isDepositOpen} onClose={onDepsoitClose} size={"xl"}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Deposit funds</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <DepositFunds />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
