import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import CartInventory from "../wallet/CartInventory";

export default function CartModal({ isCartOpen, onCartOpen, onCartClose }) {
  // Grabbing a user from global storage via redux
  const user = useSelector((state) => state.data.user.user);

  return (
    <Modal isOpen={isCartOpen} onClose={onCartClose} size={"xl"}>
      <ModalOverlay />
      <ModalContent minWidth="50%">
        <ModalHeader>Cart</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <CartInventory />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
