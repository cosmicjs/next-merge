type AvatarProps = {
  name: string, 
  picture: string,
};

const Avatar = (props: AvatarProps) => {
  const { name, picture } = props;
  return (
    <div className="flex items-center">
      {picture && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`${picture}?auto=format,compress,enhance&w=100&h=100`}
          className="w-12 h-12 rounded-full mr-4"
          alt={name}
        />
      )}
      <div className="text-xl font-bold">{name}</div>
    </div>
  )
}

export default Avatar;
