import {
  getNotifications,
  logout,
  updateNotiReadOption,
} from "@/database/firebase";
import { Noti, UserInterface } from "@/types/types";
import { isArrayEmpty } from "@/utils/functions";
import { AddIcon, CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Flex,
  HStack,
  Heading,
  IconButton,
  List,
  ListItem,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface NavLinkProps {
  children: {
    name: string;
    href: string;
  };
}

const Links = [
  { name: "친구", href: "/friends" },
  { name: "파티", href: "/parties" },
  { name: "길드", href: "/guilds" },
];

const NavLink = ({ children }: NavLinkProps) => {
  const { name, href } = children;
  return (
    <Box
      as="a"
      px={2}
      py={1}
      rounded={"md"}
      _hover={{
        textDecoration: "none",
        backgroundColor: "brand.50",
      }}
      href={href}
      fontWeight="bold"
      color="white"
    >
      {name}
    </Box>
  );
};

const Header = ({ user }: { user: UserInterface }) => {
  const [notiList, setNotiList] = useState<Array<Noti>>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  const onNotiClick = (notiId: string, notiTab: string) => {
    readNotifications(notiId);
    navigate("/myRequests", {
      state: {
        defaultRequestTab: "받은 요청",
        defaultTypeTab: notiTab,
      },
    });
  };

  const readNotifications = (notiId?: string) => {
    if (isArrayEmpty(notiList)) return;
    if (notiId) {
      updateNotiReadOption([notiId]);
    } else {
      const notiIdArray = notiList.map((noti) => {
        return noti.id;
      });
      updateNotiReadOption(notiIdArray);
    }
  };

  useEffect(() => {
    getNotifications(user.uid, setNotiList);
  }, []);

  return (
    <>
      <Box backgroundColor="brand.100" px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={"center"}>
            <Link to='/'><Heading variant='logo'>99%</Heading></Link>
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              {Links.map((link) => (
                <NavLink key={link.name}>{link}</NavLink>
              ))}
            </HStack>
          </HStack>
          <Flex alignItems={"center"}>
            <Link to="/newProfile">
              <Button
                variant={"solid"}
                backgroundColor="brand.50"
                size={"sm"}
                mr={2}
                leftIcon={<AddIcon />}
              >
                프로필 생성
              </Button>
            </Link>
            <Popover>
              <PopoverTrigger>
                <Button background="none" mr="2">
                  <i className="fa-solid fa-bell"></i>
                  <Box
                    w="5"
                    borderRadius="full"
                    backgroundColor="brand.500"
                    pos="absolute"
                    top="0.5"
                    right="0.5"
                  >
                    {!isArrayEmpty(notiList) && notiList?.length}
                  </Box>
                </Button>
              </PopoverTrigger>
              <PopoverContent mt="1" maxWidth="18rem">
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader textAlign="center">알림</PopoverHeader>
                <PopoverBody textAlign="center" pr="0" pl="0">
                  {!isArrayEmpty(notiList) ? (
                    <Flex justify="center" mt="1">
                      <Button
                        size="sm"
                        fontSize="sm"
                        onClick={() => readNotifications()}
                      >
                        모두 읽기
                      </Button>
                    </Flex>
                  ) : (
                    <Text>새로운 알림이 없습니다</Text>
                  )}
                  <List mt="1">
                    {notiList.map((noti, idx) => {
                      const msg =
                        noti.tab === "친구"
                          ? "추가"
                          : noti.tab === "파티"
                            ? "참여"
                            : "가입";
                      return (
                        <ListItem
                          key={idx}
                          pt="1"
                          pb="1"
                          cursor="pointer"
                          _hover={{ backgroundColor: "#EAEEF2" }}
                          onClick={() => onNotiClick(noti.id, noti.tab)}
                        >
                          새로운 {noti.tab} {msg} 요청이 있습니다
                        </ListItem>
                      );
                    })}
                  </List>
                </PopoverBody>
              </PopoverContent>
            </Popover>
            <Menu>
              <MenuButton
                as={Button}
                rounded={"full"}
                variant={"link"}
                cursor={"pointer"}
                minW={0}
              >
                {user?.photoURL ? (
                  <Avatar size={"sm"} src={user.photoURL} />
                ) : (
                  <Box>{user?.displayName?.substring(0, 2)}</Box>
                )}
              </MenuButton>
              <MenuList>
                <Link to="/myRequests">
                  <MenuItem>내 요청</MenuItem>
                </Link>
                <Link to="/myProfiles">
                  <MenuItem>내 프로필</MenuItem>
                </Link>
                <Link to="/myFriends">
                  <MenuItem>내 친구/파티/길드</MenuItem>
                </Link>
                <MenuDivider />
                <MenuItem onClick={logout}>로그아웃</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              {Links.map((link) => (
                <NavLink key={link.name}>{link}</NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
};

export default Header;
