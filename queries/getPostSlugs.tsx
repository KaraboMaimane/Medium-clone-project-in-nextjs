export const getPostSlugs = `*[_type == "post"]{
    _id,
    slug {
    current
  }
  }`;