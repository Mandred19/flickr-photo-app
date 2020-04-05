
export default {
  priority: 700,
  event: null,
  bind(el, binding, vnode) {
    binding.event = null;
    if (typeof binding.value === 'function') {
      binding.event = binding.value;
    } else {
      binding.event = (event) => vnode.context.$emit(binding.value, event);
    }
    el.addEventListener('click', binding.def.stopProp);
    document.body.addEventListener('click', binding.event);
  },
  unbind(el, binding) {
    el.removeEventListener('click', binding.def.stopProp);
    document.body.removeEventListener('click', binding.event);
  },
  stopProp(event) {
    event.stopPropagation();
  }
};
