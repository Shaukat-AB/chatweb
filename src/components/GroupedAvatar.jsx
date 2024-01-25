import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import stringToColor from "../utils/stringToColor";
import { useSelector } from "react-redux";

const groupStyle = (width) => ({
    width: width,
    height: width,
    fontSize: width < 40 ? "small" : "meduim",
});

const GroupedAvatar = ({
    max = 3,
    width = 24,
    variant = "",
    groupProps = {},
}) => {
    const channels = useSelector((state) => state.channels);
    const current = useSelector((state) => state.navigation.current);
    const mIds = channels[current.id]?.members;
    const member = channels[current.id]?.member;

    const avs =
        mIds &&
        mIds.map((id, index) => {
            if (!member[id] || index > max) return;

            return (
                <TextAvatar
                    key={id}
                    text={member[id]?.name}
                    src={member[id]?.avatarURL}
                    width={width}
                    variant={variant}
                />
            );
        });
    return (
        <AvatarGroup
            max={max}
            total={mIds.length}
            {...groupProps}
            slotProps={{
                additionalAvatar: {
                    sx: { ...groupStyle(width) },
                },
            }}
        >
            {avs}
        </AvatarGroup>
    );
};

export const TextAvatar = ({
    text,
    width = 40,
    variant = "",
    src = "",
    sx = {},
    avatarProps = {},
}) => {
    const style = {
        ...groupStyle(width),
        bgcolor: stringToColor(text),
        ...sx,
    };

    return (
        <Avatar
            variant={variant}
            alt={text}
            src={src}
            sx={style}
            {...avatarProps}
        >
            {text[0]}
        </Avatar>
    );
};

export default GroupedAvatar;
