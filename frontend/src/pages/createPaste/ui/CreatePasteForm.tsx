import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useTheme } from "next-themes";
import { zodResolver } from "@hookform/resolvers/zod";
import { createListCollection, Flex, Float, Input } from "@chakra-ui/react";

import { Languages as RawLanguages } from "@/shared/types/languages.ts";
import { TextVaultEditor } from "@/components/TextVaultEditor/TextVaultEditor.tsx";
import { createPasteSchema, CreatePasteSchema } from "@/pages/createPaste/types.ts";
import { Field } from "@/components/ui/field";
import { Button } from "@/components/ui/button.tsx";
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@/components/ui/select";

interface CreatePasteFormProps {
  onSubmit: SubmitHandler<CreatePasteSchema>;
}

const Languages = createListCollection({
  items: RawLanguages,
});

export const CreatePasteForm = ({ onSubmit }: CreatePasteFormProps) => {
  const { theme } = useTheme();
  const {
    register,
    control,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<CreatePasteSchema>({
    resolver: zodResolver(createPasteSchema),
  });

  return (
    <Flex asChild flexDirection={"column"} gap={4} p={6} rounded={"lg"} shadow={"lg"}>
      <form className="light:bg-default-100 dark:bg-[#141414] rounded-lg shadow-lg p-6 flex flex-col gap-4">
        <Flex gap={4} mb={"4"} width={"full"}>
          {/*<Form.Item<CreatePasteSchema> required className={"flex-1 w-96"} name={"title"}>*/}
          <Field
            errorText={errors?.title?.message}
            flex={1}
            invalid={!!errors.title}
            label={"Title"}
            width={"96"}
          >
            <Input
              {...register("title", { required: "Title is required" })}
              placeholder="Enter paste title..."
            />
          </Field>
          {/*<Form.Item<CreatePasteSchema> required className={"w-32"} name={"language"}>*/}
          <Field
            errorText={errors.language?.message}
            invalid={!!errors.language}
            label="Language"
            width="32"
          >
            <Controller
              control={control}
              name="language"
              render={({ field }) => (
                <SelectRoot
                  collection={Languages}
                  multiple={false}
                  name={field.name}
                  value={field.value}
                  onInteractOutside={() => field.onBlur()}
                  onValueChange={({ value }) => {
                    console.log("value", value);
                    field.onChange(value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValueText placeholder="Select language..." />
                  </SelectTrigger>
                  <SelectContent>
                    {Languages.items.map((language) => (
                      <SelectItem key={language.value} item={language}>
                        {language.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </SelectRoot>
              )}
            />
          </Field>
        </Flex>
        <Field height={"full"} mb={4} px={8} width={"full"}>
          <Controller
            control={control}
            name={"content"}
            render={({ field: { value, onChange } }) => (
              <TextVaultEditor
                language={getValues("language")?.[0] || "plaintext"}
                loading={false}
                readOnly={false}
                theme={theme}
                value={value}
                onChange={onChange}
              />
            )}
          />
        </Field>
        <Float justifyContent={"end"} mt={2}>
          <Button colorPalette={"blue"} px={6} onClick={() => handleSubmit(onSubmit)()}>
            Save Paste
          </Button>
        </Float>
      </form>
    </Flex>
  );
};
