import { HStack, useRadioGroup } from "@chakra-ui/react";
import { PostTypeRadioCard } from "./PostTypeRadioCard";
import { Can } from "@/lib/casl/Can";
import { subject } from "@casl/ability";

interface PostTypeRadioProps {
    scopeId: number;
    initialValue: 'WIN' | 'FINE' | 'PAYMENT';
    onChange: (value) => void;
}

export const PostTypeRadio = ({ initialValue, onChange, scopeId }: PostTypeRadioProps) => {
    const options = [
        { value: 'WIN', label: '🎉 Win' },
        { value: 'FINE', label: '🚨 Fine' },
        { value: 'PAYMENT', label: '💰 Pay' }];

    const { getRootProps, getRadioProps } = useRadioGroup({
        name: 'postType',
        defaultValue: initialValue,
        onChange: onChange
    });

    const group = getRootProps();

    return (
        <HStack {...group} width="full" justifyContent="space-between" height="fit-content">
            {options.map(option => {
                const radio = getRadioProps({ value: option.value });

                return (
                    <Can I="post" this={subject('Post', { scopeId: scopeId, type: option.value })} key={option.value}>
                        <PostTypeRadioCard {...radio}>{option.label}</PostTypeRadioCard>
                    </Can>
                );
            })}
        </HStack>
    );
};