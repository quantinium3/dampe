import { createId } from "@paralleldrive/cuid2"

export default function createNamespacedId(namespace: string) {
    return namespace + " " + createId();
}
