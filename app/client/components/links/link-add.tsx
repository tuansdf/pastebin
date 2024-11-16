import { CreateVaultFormValues } from "@/.server/vault.type";
import { ErrorMessage } from "@/client/components/shared/error";
import { ScreenLoading } from "@/client/components/shared/screen-loading";
import { useAppStore } from "@/client/shared/app.store";
import { createVault } from "@/client/shared/vault.api";
import {
  DEFAULT_LINK_ID_SIZE,
  DEFAULT_NOTE_ID_SIZE,
  VAULT_EXPIRE_1_DAY,
  VAULT_EXPIRE_1_HOUR,
  VAULT_EXPIRE_1_MONTH,
  VAULT_EXPIRE_1_WEEK,
} from "@/shared/constants/common.constant";
import { createLinkFormSchema } from "@/shared/schemas/vault.schema";
import { getVaultExpiresTime } from "@/shared/utils/common.util";
import {
  encryptText,
  generateEncryptionConfigs,
  generateHashConfigs,
  generateId,
  generatePassword,
  hashPassword,
} from "@/shared/utils/crypto.util";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, CopyButton, Group, NativeSelect, PasswordInput, Switch, TextInput, Title } from "@mantine/core";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

const defaultFormValues: CreateVaultFormValues = {
  content: "",
  password: "",
  masterPassword: "",
  expiresAt: VAULT_EXPIRE_1_WEEK,
};

export const LinkAdd = () => {
  const [isShortUrl, setIsShortUrl] = useState(false);
  const { addPassword, addShortUrl } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);
  const [shortLink, setShortLink] = useState("");
  const [shortLinkWithPassword, setShortLinkWithPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<CreateVaultFormValues>({
    defaultValues: defaultFormValues,
    reValidateMode: "onSubmit",
    resolver: zodResolver(createLinkFormSchema(isShortUrl)),
  });

  const handleFormSubmit: SubmitHandler<CreateVaultFormValues> = async (data) => {
    try {
      setErrorMessage("");
      setIsLoading(true);
      const hashConfigs = generateHashConfigs();
      const encryptionConfigs = generateEncryptionConfigs();
      const promises = [
        data.password ? hashPassword(data.password, hashConfigs) : generatePassword(),
        data.masterPassword ? hashPassword(data.masterPassword, hashConfigs) : undefined,
      ] as const;
      const [password, masterPassword] = await Promise.all(promises);
      const encrypted = await encryptText(data.content!, password, encryptionConfigs.nonce);
      const guestPassword = isShortUrl ? undefined : generateId(DEFAULT_NOTE_ID_SIZE);
      const body = await createVault(
        {
          content: encrypted || "",
          configs: { hash: hashConfigs, encryption: encryptionConfigs },
          masterPassword,
          guestPassword,
          expiresAt: getVaultExpiresTime(Number(data.expiresAt)),
        },
        isShortUrl ? DEFAULT_LINK_ID_SIZE : DEFAULT_NOTE_ID_SIZE
      );
      addPassword(password);
      const shortLink = window.location.origin + `/s/${body.publicId}` + (isShortUrl ? "" : `?${guestPassword}`);
      addShortUrl(shortLink);
      setShortLink(shortLink);
      setShortLinkWithPassword(shortLink + `#${password}`);
    } catch (e) {
      setErrorMessage("Something Went Wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    reset();
    setShortLink("");
  };

  const isSubmitted = !!shortLink;

  return (
    <>
      <Card component="form" onSubmit={handleSubmit(handleFormSubmit)} className="k-card-form">
        <Switch checked={isShortUrl} onChange={(e) => setIsShortUrl(e.currentTarget.checked)} label="Short URL" />
        <Title size="h3">{isShortUrl ? "Shorten" : "Mask"} a URL</Title>
        <TextInput
          autoComplete="off"
          autoFocus
          withAsterisk
          label="Original URL"
          readOnly={isSubmitted}
          {...register("content")}
          error={errors.content?.message}
        />
        {!isSubmitted && (
          <>
            {isShortUrl && (
              <PasswordInput
                type="password"
                autoComplete="current-password"
                label="Password"
                withAsterisk
                {...register("password")}
                error={errors.password?.message}
                description="To unlock this link"
              />
            )}
            <PasswordInput
              type="password"
              autoComplete="current-password"
              label="Master password"
              {...register("masterPassword")}
              error={errors.masterPassword?.message}
              description="To perform update/delete (optional)"
            />
            <NativeSelect label="Expires after" data={expireOptions} {...register("expiresAt")} />
          </>
        )}
        {isSubmitted && (
          <>
            <TextInput readOnly label={isShortUrl ? "Short URL" : "Masked URL"} value={shortLink} />
            <Group>
              <Button component="a" href={shortLink} target="_blank" variant="default">
                Open
              </Button>
              <CopyButton value={shortLink}>
                {({ copied, copy }) => (
                  <Button color={copied ? "teal" : "blue"} onClick={copy}>
                    {copied ? "Copied URL" : "Copy URL"}
                  </Button>
                )}
              </CopyButton>
              <CopyButton value={shortLinkWithPassword}>
                {({ copied, copy }) => (
                  <Button color={copied ? "teal" : "blue"} onClick={copy}>
                    {copied ? "Copied URL" : "Copy URL (password embed)"}
                  </Button>
                )}
              </CopyButton>
            </Group>
          </>
        )}
        {!isSubmitted && (
          <Button type="submit" w="max-content">
            Submit
          </Button>
        )}
        {isSubmitted && (
          <Button type="reset" w="max-content" onClick={resetForm}>
            Create another
          </Button>
        )}
      </Card>

      <ScreenLoading isLoading={isLoading} />

      {!!errorMessage && <ErrorMessage msg={errorMessage} />}
    </>
  );
};

const expireOptions = [
  {
    value: String(VAULT_EXPIRE_1_HOUR),
    label: "1 hour",
  },
  {
    value: String(VAULT_EXPIRE_1_DAY),
    label: "1 day",
  },
  {
    value: String(VAULT_EXPIRE_1_WEEK),
    label: "1 week",
  },
  {
    value: String(VAULT_EXPIRE_1_MONTH),
    label: "1 month",
  },
];
