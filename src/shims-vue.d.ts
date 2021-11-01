declare module "*.vue" {
  import { defineAsyncComponent } from "vue";
  const component: ReturnType<typeof defineAsyncComponent>;
  export default component;
}
