import {
    integer,
    pgEnum,
    pgTable,
    primaryKey,
    text,
    timestamp,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";
import createNamespacedId from "@/utils/create-namespace-id"

export const upload_state_enum = pgEnum("upload_state", [
    "uploading",
    "uploaded",
    "failed",
]);

export const permission_enum = pgEnum("permission", [
    "owner",
    "read",
    "write",
]);

export const fileshare_permission = pgEnum("fileshare_permission", [
    "read",
    "write",
]);

export const files = pgTable("files", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => createNamespacedId("file")),
    name: text("name").notNull(),
    mime_type: text("mime_type").notNull(),
    size: integer("size").notNull(),
    key: text("key").notNull(),
    upload_state: upload_state_enum("upload_state").notNull().default("uploading"),
    uploaded_by: text("uploaded_by")
        .notNull()
        .references(() => user.id),
    created_at: timestamp("created_at", {
        mode: "date",
        withTimezone: true
    }).notNull().defaultNow(),
    updated_at: timestamp("updated_at", {
        mode: "date",
        withTimezone: true
    }).notNull().defaultNow(),
});

export const userFiles = pgTable(
    "user_files",
    {
        user_id: text("user_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
        file_id: text("file_id")
            .notNull()
            .references(() => files.id, { onDelete: "cascade" }),
        permission: permission_enum("permission").notNull(),
        shared_by: text("shared_by")
            .notNull()
            .references(() => user.id),
        shared_at: timestamp("shared_at").notNull().defaultNow(),
    },
    (t) => ({
        pk: primaryKey({ columns: [t.user_id, t.file_id] }),
    })
);

export const sharedFiles = pgTable("shared_file", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => createNamespacedId("shared_file")),
    file_id: text("file_id")
        .notNull()
        .references(() => files.id, { onDelete: "cascade" }),
    token: text("token").notNull().unique(),
    permission: fileshare_permission("permission").notNull(),
    expires_at: timestamp("expires_at", {
        mode: "date",
        withTimezone: true,
    }),
    created_at: timestamp("created_at", {
        mode: "date",
        withTimezone: true,
    }).defaultNow(),
});
