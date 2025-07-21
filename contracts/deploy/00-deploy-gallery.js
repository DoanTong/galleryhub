module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy("GalleryNFT", {
    from: deployer,
    args: [],        // nếu constructor không cần tham số
    log: true,
  });

  await deploy("GalleryToken", {
    from: deployer,
    args: ["Gallery Token", "ARTX"],   // nếu constructor cần tên và ký hiệu
    log: true,
  });
};

module.exports.tags = ["Gallery"];
